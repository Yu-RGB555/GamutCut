class ApplicationController < ActionController::API
  before_action :authenticate_user_from_token!

  private

  def authenticate_user_from_token!
    auth_header = request.headers['Authorization']
    if auth_header.present? && auth_header[/^Bearer /]
      token = auth_header.split(' ').last
      begin
        payload = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        @current_user = User.find_by(id: payload['user_id'])
      rescue JWT::DecodeError
        @current_user = nil
      end
    else
      @current_user = nil
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    render json: { error: 'Unauthorized' }, status: :unauthorized unless current_user
  end

  protected

  # MinIOの直接URLを生成するヘルパーメソッド
  def minio_direct_url(attachment)
    return nil unless attachment&.attached?

    blob = attachment.blob
    service = blob.service

    # S3互換サービス（MinIO）の場合
    if service.is_a?(ActiveStorage::Service::S3Service)
      endpoint = ENV['AWS_ENDPOINT'] || "http://minio:9000"
      bucket = ENV['S3_BUCKET_NAME']

      # Docker内部のminio:9000をlocalhostに変換（フロントエンド用）
      if endpoint.include?('minio:9000')
        endpoint = endpoint.gsub('minio:9000', 'localhost:9000')
      end

      "#{endpoint}/#{bucket}/#{blob.key}"
    else
      # フォールバック：通常のActive Storage URL
      url_for(attachment)
    end
  end
end