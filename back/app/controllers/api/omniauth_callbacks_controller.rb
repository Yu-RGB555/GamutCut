class Api::OmniauthCallbacksController < ApplicationController
  def create
    begin
      auth = request.env["omniauth.auth"]
      user = User.from_omniauth(auth)

      if user.persisted?
        # 既存のJWT生成ロジックを使用（sessions#createと同様）
        token = generate_jwt_token(user)

        # フロントエンドにリダイレクト
        redirect_to "#{frontend_url}/auth/callback?token=#{token}&success=true", allow_other_host: true
      else
        redirect_to "#{frontend_url}/auth/callback?success=false&error=registration_failed", allow_other_host: true
      end
    rescue => e
      Rails.logger.error "OAuth callback error: #{e.message}"
      redirect_to "#{frontend_url}/auth/callback?success=false&error=oauth_error", allow_other_host: true
    end
  end

  private

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end

  def frontend_url
    Rails.env.production? ? ENV['FRONTEND_URL'] : 'http://localhost:3003'
  end
end