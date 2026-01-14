class ApplicationController < ActionController::API
  before_action :set_locale
  before_action :authenticate_user_from_token!

  private

  def set_locale
    # Accept-Languageヘッダーから言語を判定
    locale = extract_locale || I18n.default_locale
    I18n.locale = locale
  end

  def extract_locale
    Rails.logger.debug "request.env[HTTP_ACCEPT_LANGUAGE]: #{request.env["HTTP_ACCEPT_LANGUAGE"]}"
    request.env["HTTP_ACCEPT_LANGUAGE"]&.scan(/^[a-z]{2}/)&.first&.to_sym
  end

  def authenticate_user_from_token!
    # ヘッダーから認証情報を取得
    auth_header = request.headers["Authorization"]
    Rails.logger.debug "Bearer<token>：#{auth_header}"

    # JWT認証
    if auth_header.present? && auth_header[/^Bearer /]
      token = auth_header.split(" ").last
      Rails.logger.debug "token: #{token}"

      begin
        # JWT生成時に保存した秘密鍵（credentials）で署名検証しデコード
        payload = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
        Rails.logger.debug "payload: #{payload}"
        user_id = payload["user_id"]
        if user_id
          @current_user = User.find_by(id: user_id)
        else
          @current_user = nil
        end
      rescue StandardError => e
        Rails.logger.debug "例外発生: #{e.message}"
        @current_user = nil
      end
    else
      Rails.logger.debug "No valid Authorization header present"
      @current_user = nil
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!
    unless current_user
      render json: { errors: [ "ログインが必要です" ] }, status: :unauthorized
      return false
    end
    true
  end
end
