class Api::RegistrationsController < ApplicationController
  skip_before_action :authenticate_user_from_token!, only: [:create]

  def create
    user = User.new(sign_up_params)

    if user.save
      token = generate_jwt_token(user)
      render json: {
        message: "ユーザーが正常に作成されました",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      }, status: :created
    else
      error_message = I18n.t('errors.messages.invalid_credentials')
      Rails.logger.info "Login failed - sending error: #{error_message}"

      render json: {
        errors: [error_message]
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def generate_jwt_token(user)
    payload = { user_id: user.id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end
end
