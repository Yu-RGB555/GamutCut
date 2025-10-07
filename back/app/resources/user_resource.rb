class UserResource < BaseResource
  attributes :id, :name, :email, :avatar_url, :bio, :x_account_url

  # カスタムアバターURL属性（Active Storage対応）
  attribute :avatar_url do |user|
    user.avatar_url
  end
end