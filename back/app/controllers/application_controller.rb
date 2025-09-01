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
end