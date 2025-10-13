class UserMailer < ApplicationMailer
  def password_reset(user)
    @user = user

    # フロントエンドのURLを取得
    frontend_url = ENV['FRONTEND_URL']

    # メール内に埋め込むパスワード変更画面のリンク
    @reset_url = "#{frontend_url}/auth/password-reset?token=#{user.reset_password_token}"

    mail(
      to: @user.email,
      subject: 'パスワードリセットのご案内'
    )
  end
end
