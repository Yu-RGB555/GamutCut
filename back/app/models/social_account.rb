class SocialAccount < ApplicationRecord
  belongs_to :user

  validates :provider, presence: true
  validates :provider_user_id, presence: true
  validates :provider, uniqueness: { scope: :user_id }
  validates :provider_user_id, uniqueness: { scope: :provider }

  def update_from_omniauth(auth)
    update!(
      access_token: auth.credentials.token,
      refresh_token: auth.credentials.refresh_token,
      token_expires_at: auth.credentials.expires_at ? Time.at(auth.credentials.expires_at) : nil,
      scope: auth.credentials.scope,
      provider_data: auth.extra,
      last_login_at: Time.current
    )
  end
end
