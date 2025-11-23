class User < ApplicationRecord
  include MinioUrlHelper

  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  # アバター（プロフィール画面用）
  has_one_attached :avatar
  ACCEPTED_CONTENT_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'].freeze

  has_many :works, dependent: :destroy
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
  validates :avatar, size: { less_than: 5.megabytes }      # アバターアイコン用
  validates :reset_password_token, uniqueness: true, allow_nil: true

  # Ransackで検索可能な属性を明示的に定義
  def self.ransackable_attributes(auth_object = nil)
    ["name", "created_at", "updated_at"]
  end

  # アバター画像のURLを取得（画像なし許容）
  def avatar_url
    return nil unless avatar.attached?

    # リサイズ不要な場合は直接URL取得
    minio_direct_url(avatar)
  end

  # SNS認証でログインしたユーザーかどうか判定
  # 「メアド変更」「パスワード変更」ページへのアクセス制限用
  def has_social_accounts?
    social_accounts.exists?
  end

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

    # メールアドレスが存在する場合、既存ユーザーを検索してアカウント統合
    user = nil
    if auth.info.email.present?
      user = User.find_by(email: auth.info.email)

      if user
        # 既存ユーザーに新しいソーシャルアカウントを統合
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

    # 英数字のみのランダムパスワードを生成
    random_password = SecureRandom.alphanumeric(20)

    # メールアドレスがない場合はダミーメールを生成（Xアカウント用）
    email = auth.info.email.presence || generate_dummy_email(auth)

    # OmniAuthで取得したSNSユーザー情報を元に、usersとsocial_accountsのレコードを作成
    User.transaction do
      user = User.create!(
        email: email,
        name: auth.info.name || auth.info.nickname || "User",
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

      # SNS認証の画像をavatarとしてアタッチ
      if auth.info.image.present?
        attach_avatar_from_url(user, auth.info.image)
      end

      user
    end
  end

  # === パスワードリセット機能 ===

  # リセットトークンの生成
  def generate_password_reset_token!
    self.reset_password_token = SecureRandom.urlsafe_base64(32)
    self.reset_password_sent_at = Time.current
    save!(validate: false)
  end

  # 有効期限チェック
  def password_reset_expired?
    # 有効期限切れ（＝true）
    reset_password_sent_at && reset_password_sent_at < 1.hours.ago
  end

  # パスワードリセット
  def reset_password!(new_password)
    # 有効期限切れの場合は無効
    return false if password_reset_expired?

    # パスワード更新
    self.password = new_password

    # トークンクリア
    self.reset_password_token = nil
    self.reset_password_sent_at = nil
    save
  end

  # トークンを使用してユーザー検索（クラスメソッド）
  def self.find_by_password_reset_token(token)
    return nil if token.blank?
    find_by(reset_password_token: token)
  end

  private

  def self.generate_dummy_email(auth)
    # プロバイダーとUIDを使ってダミーメールアドレスを生成
    "#{auth.provider}_#{auth.uid}@dummy.local"
  end

  def self.update_user_profile_from_auth(user, auth)
    # 既存情報が空の場合のみ更新
    updates = {}

    # アバター画像が添付されていない場合、avatarとしてアタッチ
    if !user.avatar.attached? && auth.info.image.present?
      attach_avatar_from_url(user, auth.info.image)
    end

    if user.name.blank? && (auth.info.name || auth.info.nickname).present?
      updates[:name] = auth.info.name || auth.info.nickname
    end

    user.update!(updates) if updates.any?
  end

  # auth.info.imageをダウンロード＆解像度変換し、avatarとしてアタッチ
  def self.attach_avatar_from_url(user, image_url)
    require 'open-uri'

    # 解像度を変換（Google: 200x200, X: 400x400）
    resize_image_url = image_url.gsub(/=s\d+-c/, '=s200-c').gsub(/_(normal|bigger|mini)(\.[a-z]+)$/, '_400x400\2')
    downloaded = URI.open(resize_image_url)
    content_type = downloaded.content_type

    user.avatar.attach(
      io: downloaded,
      filename: "avatar_#{SecureRandom.hex(8)}",
      content_type: content_type
    )
  end


  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
