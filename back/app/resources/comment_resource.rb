class CommentResource < BaseResource
  attributes :id, :content, :created_at, :updated_at

  # ネストしたuserオブジェクト
  attribute :user do |comment|
    {
      id: comment.user.id,
      name: comment.user.name,
      avatar_url: comment.user.avatar_url
    }
  end

  # フォーマット済みの作成日時（日本語形式）
  attribute :created_at do |comment|
    comment.created_at.strftime("%Y-%m-%dT%H:%M:%S.%LZ")
  end

  # フォーマット済みの更新日時
  attribute :updated_at do |comment|
    comment.updated_at.strftime("%Y-%m-%dT%H:%M:%S.%LZ")
  end
end
