class Api::V1::WorksController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy, :like, :bookmark]
  before_action :authenticate_user_optional!, only: [:index, :show]
  before_action :set_work, only: [:update, :destroy]
  before_action :set_any_work, only: [:like, :bookmark]
  before_action :check_owner, only: [:update, :destroy]

  def index
    # Ransackを使用した検索・ソート機能
    base_query = Work.where(is_public: 'published')
    @q = base_query.ransack(search_params)

    # 検索結果を取得（重複回避のため、最後にincludesを適用）
    @works = @q.result.includes([:user, :illustration_image_attachment, :illustration_image_blob])
              .order(created_at: :desc)

    render json: {
      works: WorkIndexResource.new(@works, current_user: current_user).serializable_hash
    }
  end

  def create
    @work = current_user.works.build(work_params.except(:illustration_image, :tags))

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
      if params[:work][:tags].present?
        attach_tags_to_work(@work, params[:work][:tags])
      end

      render json: {
        message: I18n.t('api.work.create.success')
      }, status: :created
    else
      render json: {
        errors: @work.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def show
    @work = Work.includes([:user, :tags, :illustration_image_attachment, :illustration_image_blob]).find(params[:id])

    render json: WorkShowResource.new(@work, current_user: current_user)
  end

  def update
    # work_paramsからremove_illustration_image(削除フラグ)を除外してupdate
    update_params = work_params.except(:remove_illustration_image)

    # 画像削除フラグがある場合の処理
    if params[:work][:remove_illustration_image] == 'true'
      Rails.logger.info "Attempt to remove required illustration_image"
      render json: {
        errors: ['イラスト作品がアップロードされていません']
      }, status: :unprocessable_entity
      return
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
      render json: {
        message: I18n.t('api.work.update.success')
      }, status: :ok
    else
      render json: {
        errors: @work.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @work.destroy
    render json: { message: I18n.t('api.work.destroy.success') }
  end

  # 画像を取得してクライアントに返すプロキシメソッド
  def image
    @work = Work.find(params[:id])

    unless @work.illustration_image.attached?
      render json: { error: '画像が見つかりません' }, status: :not_found
      return
    end

    # Active Storageから画像データを取得
    begin
      # 画像のバイナリデータを取得
      image_data = @work.illustration_image.download

      # 適切なContent-Typeを設定
      response.headers['Content-Type'] = @work.illustration_image.content_type
      response.headers['Content-Disposition'] = 'inline'

      # 画像データをレスポンスとして返す
      render body: image_data, content_type: @work.illustration_image.content_type
    rescue => e
      Rails.logger.error "Failed to download image: #{e.message}"
      render json: { error: '画像の取得に失敗しました' }, status: :internal_server_error
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
        render json: { error: '対象の作品はいいねされていません' }, status: :not_found
      end
    else
      # POST の場合はいいねを追加
      if existing_like
        # いいねしている状態で、URL直叩きされた場合の対策
        render json: {
          message: '既にいいね済みです',
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
        render json: { error: '対象の作品はブックマークされていません'}, status: :not_found
      end
    else
      # POST の場合
      if existing_bookmark
        render json: {
          message: '既にブックマーク済みです',
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
    render json: { error: '作品が見つかりません' }, status: :not_found
  end

  def check_owner
    unless @work.user == current_user
      render json: {
        errors: ['この作品を編集する権限がありません']
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

  # タグを作品に関連付けるプライベートメソッド
  def attach_tags_to_work(work, tag_names)
    return unless tag_names.is_a?(Array)

    tag_names.each do |tag_name|
      next if tag_name.blank?

      # find_or_create_byでタグを取得または作成
      tag = Tag.find_or_create_by(name: tag_name.strip)

      # 重複チェックして作品にタグを関連付け
      unless work.tags.include?(tag)
        work.tags << tag
      end
    end
  end
end