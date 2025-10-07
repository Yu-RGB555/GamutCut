class User < ApplicationRecord
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  # アバター（プロフィール画面用）
  has_one_attached :avatar
  ACCEPTED_CONTENT_TYPES = ['image/png', 'image/jpeg'].freeze

  has_many :works, dependent: :restrict_with_exception  # 作品がある場合は退会不可
  has_many :presets, dependent: :destroy
  has_many :social_accounts, dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :liked_works, through: :likes, source: :work
  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_works, through: :bookmarks, source: :work
  has_many :comments, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 8 }, format: { with: /\A[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+\z/ }, if: :password_required?
  validates :bio, length: { maximum: 300 }
  validates :avatar, content_type: ACCEPTED_CONTENT_TYPES  # アバターアイコン用
  validates :avatar, size: { less_than: 2.megabytes }      # アバターアイコン用

  # Ransackで検索可能な属性を明示的に定義
  def self.ransackable_attributes(auth_object = nil)
    ["name", "created_at", "updated_at"]
  end

  # アバター画像のURLを取得（画像なし許容）
  def avatar_url(size: nil)
    if avatar.attached?
      if size
        Rails.application.routes.url_helpers.rails_representation_url(
          avatar.variant(resize_to_limit: size), only_path: false
        )
      else
        Rails.application.routes.url_helpers.rails_blob_url(avatar, only_path: false)
      end
    else
      # デフォルトアバターまたは既存のavatar_urlカラムの値を返す
      read_attribute(:avatar_url)
    end
  end

  # サムネイル用のアバターURL取得
  def avatar_thumbnail_url
    avatar_url(size: [150, 150])
  end

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
