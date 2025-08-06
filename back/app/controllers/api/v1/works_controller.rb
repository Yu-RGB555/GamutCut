class Api::V1::WorksController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :set_work, only: [:update, :destroy]
  before_action :check_owner, only: [:update, :destroy]

  def index
    @works = Work.includes([:user, :illustration_image_attachment, :illustration_image_blob]).where(is_public: 'published').order(created_at: :desc)

    render json: {
      works: @works.map do |work|
        {
          id: work.id,
          title: work.title,
          illustration_image_url: work.illustration_image.attached? ? minio_direct_url(work.illustration_image) : nil,
          set_mask_data: work.set_mask_data,
          user: {
            id: work.user.id,
            name: work.user.name,
            avatar_url: work.user.avatar_url
          },
          created_at: work.created_at.strftime("%Y年%-m月%-d日 %H:%M")
        }
      end
    }
  end

  def create
    @work = current_user.works.build(work_params.except(:illustration_image))

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
      render json: {
        message: I18n.t('api.work.create.success'),
        work: {
          id: @work.id,
          title: @work.title,
          description: @work.description,
          illustration_image_url: @work.illustration_image.attached? ? url_for(@work.illustration_image) : nil,
          filename: @work.filename,
          filesize: @work.filesize
        }
      }, status: :created
    else
      render json: {
        errors: @work.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def show
    @work = Work.find_by(id: params[:id])

    render json: {
      id: @work.id,
      title: @work.title,
      illustration_image_url: minio_direct_url(@work.illustration_image),
      filename: @work.filename,
      filesize: @work.filesize,
      set_mask_data: @work.set_mask_data,
      description: @work.description,
      user: {
        id: @work.user.id,
        name: @work.user.name,
        avatar_url: @work.user.avatar_url
      },
      created_at: @work.created_at.strftime("%Y年%-m月%-d日 %H:%M")
    }
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
        message: I18n.t('api.work.update.success'),
        work: {
          id: @work.id,
          title: @work.title,
          description: @work.description
        }
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

  private

  def set_work
    @work = current_user.works.find(params[:id])
  end

  def check_owner
    unless @work.user == current_user
      render json: {
        errors: ['この作品を編集する権限がありません']
      }, status: :forbidden
    end
  end

  def work_params
    permitted_params = params.require(:work).permit(:title, :description, :is_public, :illustration_image, :filename, :filesize, :set_mask_data, :remove_illustration_image)

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
end