class UserResource < BaseResource
  attributes :id, :name, :email, :bio, :x_account_url

  # カスタムアバターURL属性（Active Storage対応）
  attribute :avatar_url do |user|
    user.avatar_url
  end

  # SNS認証アカウントかどうかの判定
  # 「メアド変更」「パスワード変更」ページへのアクセス制限用
  attribute :has_social_accounts do |user|
    user.has_social_accounts?
  end
end