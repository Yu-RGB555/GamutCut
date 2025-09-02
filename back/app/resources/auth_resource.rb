class AuthResource < BaseResource
  attributes :token, :message

  # ネストしたuserオブジェクト
  attribute :user do |data, params|
    UserResource.new(data[:user])
  end
end