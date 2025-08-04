class ApplicationController < ActionController::API
  before_action :set_locale
  before_action :authenticate_user_from_token!

  private

  def set_locale
    # Accept-Languageヘッダーから言語を判定
    locale = extract_locale_from_accept_language_header || I18n.default_locale
    I18n.locale = locale
  end

  def extract_locale_from_accept_language_header
    request.env['HTTP_ACCEPT_LANGUAGE']&.scan(/^[a-z]{2}/)&.first&.to_sym
  end

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
    unless current_user
      render json: {
        errors: ['ログインが必要です']
      }, status: :unauthorized
      return false
    end
    true
  end

  protected

  # AWS S3(MinIO)の直接URLを生成するヘルパーメソッド
  def minio_direct_url(attachment)
    return nil unless attachment&.attached?

    blob = attachment.blob
    service = blob.service

    # S3互換サービス(MinIO、AWS S3)の場合
    if service.is_a?(ActiveStorage::Service::S3Service)
      bucket = ENV['S3_BUCKET_NAME']

      # 開発環境
      if ENV['AWS_ENDPOINT'].present?
        endpoint = ENV['AWS_ENDPOINT']

        # Docker内部のminio:9000をlocalhostに変換
        if endpoint.include?('minio:9000')
          endpoint = endpoint.gsub('minio:9000', 'localhost:9000')
        end

        "#{endpoint}/#{bucket}/#{blob.key}"
      else
        # 本番環境
        url_for(attachment)
      end
    else
      # フォールバック(通常のActive Storage URL)
      url_for(attachment)
    end
  end
end