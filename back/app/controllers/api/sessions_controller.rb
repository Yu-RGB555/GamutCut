class Api::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:user][:email])
    if user && user.valid_password?(params[:user][:password])
      token = generate_jwt_token(user)
      render json: {
        message: "ログインに成功しました",
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }, status: :ok
    else
      render json: {
        message: "ログインに失敗しました",
        errors: ["認証に失敗しました"]
      }, status: :unauthorized
    end
  end

  def destroy
    render json: { message: "ログアウトしました" }, status: :ok
  end

  private

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      exp: 24.hours.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end
end