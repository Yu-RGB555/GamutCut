class Api::RegistrationsController < ApplicationController
  def create
    user = User.new(sign_up_params)

    if user.save
      token = generate_jwt_token(user)
      render json: {
        message: "ユーザーが正常に作成されました",
        token: token,
        user: {
          id: resource.id,
          name: resource.name,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        message: "ユーザーの作成に失敗しました",
        errors: resource.errors.full_messages
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
