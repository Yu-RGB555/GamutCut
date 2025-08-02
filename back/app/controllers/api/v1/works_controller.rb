class Api::V1::WorksController < ApplicationController
  before_action :authenticate_user!, only: [:create, :destroy]
  before_action :set_work, only: [:update, :destroy]

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
          created_at: work.created_at
        }
      end
    }
  end

  def create
    @work = current_user.works.build(work_params.except(:illustration_image))
    @work.illustration_image.attach(params[:work][:illustration_image]) if params[:work][:illustration_image].present?

    if @work.save
      render json: {
        message: '作品を投稿しました',
        work: {
          id: @work.id,
          title: @work.title,
          description: @work.description,
          illustration_image_url: @work.illustration_image.attached? ? url_for(@work.illustration_image) : nil
        }
      }, status: :created
    else
      Rails.logger.error "Work validation errors: #{@work.errors.full_messages}"
      render json: { errors: @work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    @work = Work.find_by(id: params[:id])

    render json: {
      id: @work.id,
      title: @work.title,
      illustration_image_url: minio_direct_url(@work.illustration_image),
      set_mask_data: @work.set_mask_data,
      description: @work.description,
      user: {
        id: @work.user.id,
        name: @work.user.name,
        avatar_url: @work.user.avatar_url
      },
      created_at: @work.created_at
    }
  end

  def update
    if @work.update(work_params)
      head :ok
    else
      Rails.logger.error "Work validation errors: #{@work.errors.full_messages}"
      render json: { errors: @work.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @work.destroy
    render json: { message: '作品が削除されました' }
  end

  private

  def set_work
    @work = current_user.works.find(params[:id])
  end

  def work_params
    permitted_params = params.require(:work).permit(:title, :description, :is_public, :illustration_image, :set_mask_data)

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