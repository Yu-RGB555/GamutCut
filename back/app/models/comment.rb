class Comment < ApplicationRecord
  belongs_to :work
  belongs_to :user

  validates :content, presence: true, length: { maximum: 1000 }

  # デフォルトで新しい順にソート
  default_scope { order(created_at: :desc) }

end