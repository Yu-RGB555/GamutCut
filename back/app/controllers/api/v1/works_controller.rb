class Api::V1::WorksController < ApplicationController
  before_action :authenticate_user!, only: [ :create, :update, :destroy, :like, :bookmark ]
  before_action :authenticate_user_optional!, only: [ :index, :show ]
  before_action :set_work, only: [ :update, :destroy ]
  before_action :set_any_work, only: [ :like, :bookmark ]
  before_action :check_owner, only: [ :update, :destroy ]

  def index
    # Ransackを使用した検索・ソート機能
    base_query = Work.where(is_public: "published")
    @q = base_query.ransack(search_params)

    # 基本のクエリ結果を取得
    works_query = @q.result.includes([ :user, :illustration_image_attachment, :illustration_image_blob ])

    # 並び順の処理
    sort_term = params.dig(:q, :sort_term_name_eq)
    @works = apply_sort_order(works_query, sort_term)

    render json: {
      works: WorkIndexResource.new(@works, current_user: current_user).serializable_hash
    }
  end

  def create
    @work = current_user.works.build(work_params.except(:illustration_image, :tags))

    # 画像削除フラグが立っている場合は、アップロード済みの作品画像を削除
    if params[:work][:remove_illustration_image] == "true"
      @work.illustration_image.purge if @work.illustration_image.attached?
    end

    if params[:work][:illustration_image].present?
      # アップロードされたファイルオブジェクトを直接参照
      file = params[:work][:illustration_image]

      # ファイル情報を保存
      @work.filename = file.original_filename
      @work.filesize = file.size

      # ActiveStorageにファイルを添付
      @work.illustration_image.attach(file)
    end

    if @work.save
      # タグの処理
      if params[:work][:tags]
        attach_tags_to_work(@work, params[:work][:tags])
      end

      if params[:work][:is_public] == "2"
        render json: {
          message: I18n.t("api.work.create.draft_success")
        }, status: :created
      else
        render json: {
          message: I18n.t("api.work.create.success")
        }, status: :created
      end
    else
      render json: {
        errors: @work.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def show
    @work = Work.includes([ :user, :tags, :illustration_image_attachment, :illustration_image_blob ]).find(params[:id])

    render json: WorkShowResource.new(@work, current_user: current_user)
  end

  def update
    # work_paramsから削除フラグとタグを除外してupdate
    update_params = work_params.except(:remove_illustration_image, :tags)

    # 画像削除フラグが立っている場合は、アップロード済みの作品画像を削除
    if params[:work][:remove_illustration_image] == "true"
      @work.illustration_image.purge if @work.illustration_image.attached?
    end

    # 新しい画像のアップロード処理
    if params[:work][:illustration_image].present?
      file = params[:work][:illustration_image]
      @work.filename = file.original_filename
      @work.filesize = file.size
      @work.illustration_image.attach(file)
    end

    # 通常の更新処理
    if @work.update(update_params)
      # タグの更新処理（空配列でも処理する）
      if params[:work][:tags]
        update_tags_for_work(@work, params[:work][:tags])
      end

      if params[:work][:is_public] == "2"
        # 下書き状態で保存・更新する場合
        render json: {
          message: I18n.t("api.work.update.draft_success")
        }, status: :ok
      else
        # 公開状態で保存・更新する場合
        render json: {
          message: I18n.t("api.work.update.success")
        }, status: :ok
      end
    else
      render json: {
        errors: @work.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    if @work.draft?
      # 下書き状態の作品を削除する場合
      @work.destroy
      render json: { message: I18n.t("api.work.destroy.draft_success") }
    else
      # 公開中の作品を削除する場合
      @work.destroy
      render json: { message: I18n.t("api.work.destroy.success") }
    end
  end

  # 画像を取得してクライアントに返すプロキシメソッド
  def image
    @work = Work.find(params[:id])

    unless @work.illustration_image.attached?
      render json: { error: "画像が見つかりません" }, status: :not_found
      return
    end

    # Active Storageから画像データを取得
    begin
      # 画像のバイナリデータを取得
      image_data = @work.illustration_image.download

      # 適切なContent-Typeを設定
      response.headers["Content-Type"] = @work.illustration_image.content_type
      response.headers["Content-Disposition"] = "inline"

      # 画像データをレスポンスとして返す
      render body: image_data, content_type: @work.illustration_image.content_type
    rescue => e
      Rails.logger.error "Failed to download image: #{e.message}"
      render json: { error: "画像の取得に失敗しました" }, status: :internal_server_error
    end
  end

  # POST（DELETE） /api/v1/works/:id/like
  def like
    # 既にいいねしているかチェック
    existing_like = current_user.likes.find_by(work: @work)

    if request.delete?
      # DELETE の場合はいいねを削除
      if existing_like
        existing_like.destroy
        render json: {
          liked: false,
          likes_count: @work.likes.count
        }
      else
        # いいねしていない状態で、URL直叩きされた場合の対策
        render json: { error: "対象の作品はいいねされていません" }, status: :not_found
      end
    else
      # POST の場合はいいねを追加
      if existing_like
        # いいねしている状態で、URL直叩きされた場合の対策
        render json: {
          message: "既にいいね済みです",
          liked: true,
          likes_count: @work.likes.count
        }
      else
        like = current_user.likes.build(work: @work)
        if like.save
          render json: {
            liked: true,
            likes_count: @work.likes.count
          }
        else
          render json: { errors: like.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end

  # POST（DELETE） /api/v1/works/:id/bookmark
  def bookmark
    # すでにブックマークしているかチェック
    existing_bookmark = current_user.bookmarks.find_by(work: @work)

    if request.delete?
      # DELETE の場合
      if existing_bookmark
        existing_bookmark.destroy
          render json: {
            bookmarked: false
          }
      else
        render json: { error: "対象の作品はブックマークされていません" }, status: :not_found
      end
    else
      # POST の場合
      if existing_bookmark
        render json: {
          message: "既にブックマーク済みです",
          bookmarked: true
        }
      else
        bookmark = current_user.bookmarks.build(work: @work)
        if bookmark.save
          render json: {
            bookmarked: true
          }
        else
          render json: { errors: bookmark.errors.full_messages }, status: :unprocessable_entity
        end
      end
    end
  end

  private

  # オプショナル認証: ApplicationControllerの認証結果をそのまま利用
  # 未ログインでもアクセス可能、ログイン時はcurrent_userを利用
  def authenticate_user_optional!
    # ApplicationControllerで既に認証処理が完了している
    # @current_userが設定されていればログイン中、nilなら未ログイン
    # 認証に失敗してもエラーにしない（未ログイン状態として処理継続）
    true
  end

  # 自身の作品からのみ取得（更新・削除用）
  def set_work
    @work = current_user.works.find(params[:id])
  end

  # 全ての公開作品から対象の作品を取得（いいね・ブックマーク用）
  def set_any_work
    @work = Work.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "作品が見つかりません" }, status: :not_found
  end

  def check_owner
    unless @work.user == current_user
      render json: {
        errors: [ "この作品を編集する権限がありません" ]
      }, status: :forbidden
    end
  end

  # Ransack用に許可する検索パラメータ
  def search_params
    permitted_params = params[:q]&.permit(
      :title_or_user_name_cont,
      :title_or_user_name_multi_cont,
      :title_cont,
      :user_name_cont,
      :multi_keyword_search,
      :tags_name_eq,  # タグの完全一致検索
      :tags_name_cont, # タグの部分一致検索
      :sort_term_name_eq, # 並べ替え
      :s
    ) || {}

    permitted_params
  end

  def work_params
    permitted_params = params.require(:work).permit(:title, :description, :is_public, :illustration_image, :filename, :filesize, :set_mask_data, :remove_illustration_image, tags: [])

    # is_public(string)を数値に変換
    if permitted_params[:is_public].present?
      permitted_params[:is_public] = permitted_params[:is_public].to_i
    end

    # set_mask_data(文字列(JSON))をパース
    if permitted_params[:set_mask_data].present? && permitted_params[:set_mask_data].is_a?(String)
      begin
        permitted_params[:set_mask_data] = JSON.parse(permitted_params[:set_mask_data])
      rescue JSON::ParserError => e
        Rails.logger.error "JSON parse error for set_mask_data: #{e.message}"
        # パースに失敗した場合はnilを設定（バリデーションエラー）
        permitted_params[:set_mask_data] = nil
      end
    end

    permitted_params
  end

  # タグを作品に関連付けるプライベートメソッド（作成時用）
  def attach_tags_to_work(work, tag_names)
    return unless tag_names.is_a?(Array)

    tag_names.each do |tag_name|
      next if tag_name.blank?

      # find_or_create_byでタグを検索または作成
      tag = Tag.find_or_create_by(name: tag_name.strip)

      # 重複チェックして作品にタグを関連付け
      unless work.tags.include?(tag)
        work.tags << tag
      end
    end
  end

  # タグを更新するプライベートメソッド（更新時用）
  def update_tags_for_work(work, tag_names)
    return unless tag_names.is_a?(Array)

    # 更新されたタグを検索または作成
    new_tags = []
    tag_names.each do |tag_name|
      next if tag_name.blank?

      tag = Tag.find_or_create_by(name: tag_name.strip)
      new_tags << tag
    end

    # work_tagsテーブルの登録タグを上書き（既存タグを全て削除し、新しいタグに置き換える）
    work.tags = new_tags
  end

  # 並び順を適用するメソッド
  def apply_sort_order(works_query, sort_term)
    case sort_term
    when "evaluation"
      # 人気順: いいね数の降順（LEFT JOINとCOUNTを使用）
      works_query.left_joins(:likes)
                .group("works.id")
                .order("COUNT(likes.id) DESC, works.created_at DESC")
    when "upload_desc"
      # 新しい順: 作成日時の降順
      works_query.order(created_at: :desc)
    when "upload_asc"
      # 古い順: 作成日時の昇順
      works_query.order(created_at: :asc)
    else
      # デフォルト: 新しい順
      works_query.order(created_at: :desc)
    end
  end
end
