class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :works, dependent: :restrict_with_exception  # 作品がある場合は退会不可
  has_many :presets, dependent: :destroy
  has_many :social_accounts, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }, format: { with: /\A[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+\z/ }, if: :password_required?
  validates :bio, length: { maximum: 300 }

  def self.from_omniauth(auth)
    Rails.logger.debug "auth_info: #{auth.info}"
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

    # メールアドレスが存在する場合、既存ユーザーを検索してアカウント統合
    user = nil
    if auth.info.email.present?
      user = User.find_by(email: auth.info.email)

      if user
        # 既存ユーザーに新しいソーシャルアカウントを統合
        Rails.logger.info "Integrating #{auth.provider} account with existing user (email: #{auth.info.email})"

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

        # プロフィール情報を更新（既存情報が空の場合のみ）
        update_user_profile_from_auth(user, auth)

        return user
      end
    end

    # 新規ユーザーを作成
    Rails.logger.info "Creating new user from #{auth.provider} authentication"

    # 英数字のみのランダムパスワードを生成
    random_password = SecureRandom.alphanumeric(20)

    # メールアドレスがない場合はダミーメールを生成
    email = auth.info.email.presence || generate_dummy_email(auth)

    User.transaction do
      user = User.create!(
        email: email,
        name: auth.info.name || auth.info.nickname || "User",
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

      user
    end
  end

  private

  def self.generate_dummy_email(auth)
    # プロバイダーとUIDを使ってユニークなダミーメールを生成
    "#{auth.provider}_#{auth.uid}@dummy.local"
  end

  def self.update_user_profile_from_auth(user, auth)
    # 既存情報が空の場合のみ更新
    updates = {}

    if user.avatar_url.blank? && auth.info.image.present?
      updates[:avatar_url] = auth.info.image
    end

    if user.name.blank? && (auth.info.name || auth.info.nickname).present?
      updates[:name] = auth.info.name || auth.info.nickname
    end

    user.update!(updates) if updates.any?
  end


  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
