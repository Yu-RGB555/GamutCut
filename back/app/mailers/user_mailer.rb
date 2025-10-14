require 'base64'

class UserMailer < ApplicationMailer
  def password_reset(user)
    @user = user

    # フロントエンドのURLを取得（デフォルト値を設定）
    frontend_url = ENV['FRONTEND_URL']

    # メール内に埋め込むパスワード変更画面のリンク
    @reset_url = "#{frontend_url}/auth/password-reset?token=#{user.reset_password_token}"

    # ロゴ画像をBase64エンコードしてデータURIとして準備
    logo_path = Rails.root.join('public', 'app_logo.png')
    if File.exist?(logo_path)
      logo_data = File.read(logo_path)
      @logo_base64 = "data:image/png;base64,#{Base64.strict_encode64(logo_data)}"
    else
      @logo_base64 = nil
    end

    mail(
      to: @user.email,
      subject: 'パスワードリセットのご案内'
    )
  end
end
