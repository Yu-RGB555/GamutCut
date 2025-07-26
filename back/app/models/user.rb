class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :works, dependent: :restrict_with_exception  # 作品がある場合は退会不可
  has_many :presets, dependent: :destroy
  has_many :social_accounts, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :password, format: { with: /\A[a-zA-Z0-9]+\z/ }, if: :password_required?
  validates :bio, length: { maximum: 300 }
  # validates :x_account_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_blank: true

  def self.from_omniauth(auth)
    # ソーシャルアカウントから既存ユーザーを検索
    social_account = SocialAccount.find_by(
      provider: auth.provider,
      provider_user_id: auth.uid
    )

    if social_account
      # 既存のソーシャルアカウントが見つかった場合
      social_account.update_from_omniauth(auth)
      return social_account.user
    end

    # メールアドレスで既存ユーザーを検索
    user = User.find_by(email: auth.info.email)

    if user
      # 既存ユーザーに新しいソーシャルアカウントを追加
      user.social_accounts.create!(
        provider: auth.provider,
        provider_user_id: auth.uid,
        access_token: auth.credentials.token,
        refresh_token: auth.credentials.refresh_token,
        token_expires_at: auth.credentials.expires_at ? Time.at(auth.credentials.expires_at) : nil,
        scope: auth.credentials.scope,
        provider_data: auth.extra,
        last_login_at: Time.current
      )
    else
      # 新規ユーザーを作成
      # 英数字のみのランダムパスワードを生成
      random_password = SecureRandom.alphanumeric(20)
      user = User.create!(
        email: auth.info.email,
        name: auth.info.name || auth.info.nickname,
        avatar_url: auth.info.image,
        password: random_password
      )

      user.social_accounts.create!(
        provider: auth.provider,
        provider_user_id: auth.uid,
        access_token: auth.credentials.token,
        refresh_token: auth.credentials.refresh_token,
        token_expires_at: auth.credentials.expires_at ? Time.at(auth.credentials.expires_at) : nil,
        scope: auth.credentials.scope,
        provider_data: auth.extra,
        last_login_at: Time.current
      )
    end

    user
  end

  private

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
