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
    # ヘッダーから認証情報を取得
    auth_header = request.headers['Authorization']

    # 1.JWT認証
    if auth_header.present? && auth_header[/^Bearer /]
      token = auth_header.split(' ').last

      begin
        # JWT生成と同じ秘密鍵を使用（credentials）
        payload = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]

        user_id = payload['user_id'] || payload['sub']
        if user_id
          @current_user = User.find_by(id: user_id)
          Rails.logger.debug "JWT Auth success: user_id=#{user_id}, found_user=#{@current_user.present?}"
        else
          Rails.logger.debug "No user_id in payload"
          @current_user = nil
        end
      rescue JWT::DecodeError => e
        Rails.logger.debug "JWT Auth failed: #{e.message}"
        @current_user = nil
      rescue => e
        Rails.logger.debug "JWT Auth error: #{e.message}"
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
      render json: {
        errors: ['ログインが必要です']
      }, status: :unauthorized
      return false
    end
    true
  end
end