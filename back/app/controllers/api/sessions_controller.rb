class Api::SessionsController < Devise::SessionsController
  respond_to :json

  def create
    user = User.find_by(email: params[:user][:email])

    if user && user.valid_password?(params[:user][:password])
      sign_in(user)
      render json: {
        message: "ログインに成功しました",
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
    if current_user
      sign_out(current_user)
      render json: {
        message: "ログアウトしました"
      }, status: :ok
    else
      render json: {
        message: "ログインしていません"
      }, status: :unauthorized
    end
  end
end