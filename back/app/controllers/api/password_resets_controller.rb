class Api::PasswordResetsController < ApplicationController
  skip_before_action :authenticate_user_from_token!, only: [:create, :update]

  # パスワードリセットメール送信
  def create
    user = User.find_by(email: reset_email_params[:email])

    # ユーザーが存在し、かつSNS認証ユーザーでない場合のみメール送信処理を実行
    if user && !user.has_social_accounts?
      user.generate_password_reset_token!
      UserMailer.password_reset(user).deliver_now
    end

    # メール送信メッセージはユーザーが存在しない場合でも表示させる
    render json: {
      message: "入力されたメールアドレスにパスワードリセットの手順をお送りしました"
    }, status: :ok
  end

  # パスワード更新
  def update
    token = params[:token]
    user = User.find_by_password_reset_token(token)

    # ユーザーが見当たらない場合
    if user.nil?
      return render json: {
        message: "無効なリンクです"
      }, status: :unprocessable_entity
    end

    # トークンの有効期限が切れていた場合（=true）
    if user.password_reset_expired?
      return render json: {
        message: "リンクの有効期限が切れています。再度パスワードリセットを行ってください"
      }, status: :unprocessable_entity
    end

    # パスワード更新
    if user.reset_password!(reset_password_params[:password])
      render json: {
        message: "パスワードが正常に変更されました"
      }, status: :ok
    else
      render json: {
        message: "パスワードの変更に失敗しました",
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def reset_email_params
    params.require(:user).permit(:email)
  end

  def reset_password_params
    params.require(:user).permit(:password, :password_confirmation)
  end
end