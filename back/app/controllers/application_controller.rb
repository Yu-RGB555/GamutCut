class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  private

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
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