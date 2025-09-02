class Api::RegistrationsController < ApplicationController
  skip_before_action :authenticate_user_from_token!, only: [:create]

  def create
    user = User.new(sign_up_params)

    if user.save
      token = generate_jwt_token(user)

      response_data = {
        message: I18n.t('api.registrations.create.success'),
        token: token,
        user: user
      }

      render json: AuthResource.new(response_data), status: :created
    else
      error_message = I18n.t('errors.messages.invalid_credentials')
      Rails.logger.info "Login failed - sending error: #{error_message}"

      render json: {
        message: error_message
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end
end
