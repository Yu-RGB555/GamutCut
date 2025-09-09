class Like < ApplicationRecord
  belongs_to :user
  belongs_to :work

  # 同じユーザーが同じ作品に複数回いいねできないようにバリデーション
  validates :user_id, uniqueness: { scope: :work_id }
end
