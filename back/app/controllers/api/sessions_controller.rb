class Api::SessionsController < ApplicationController
  skip_before_action :authenticate_user_from_token!, only: [ :create ]

  # POST /api/users/sign_up
  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      token = generate_jwt_token(user)
      response_data = {
        message: I18n.t("api.sessions.create.success"),
        token: token,
        user: user
      }

      render json: AuthResource.new(response_data), status: :ok
    else
      error_message = I18n.t("errors.messages.invalid_credentials")
      Rails.logger.info "Login failed - sending error: #{error_message}"

      render json: {
        message: error_message
      }, status: :unauthorized
    end
  end

  # DELETE /api/users/sign_out
  def destroy
    # アカウントを物理削除
    if current_user
      current_user.destroy

      render json: {
        message: "退会手続きが完了しました"
      }, status: :ok
      nil
    else
      render json: {
        errors: [ "パスワードが正しくありません" ]
      }, status: :unprocessable_entity
      nil
    end
  end

  private

  def generate_jwt_token(user)
    payload = {
      user_id: user.id,
      exp: 7.days.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end
end
