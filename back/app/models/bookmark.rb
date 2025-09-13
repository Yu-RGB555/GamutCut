class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :work

  # 同じユーザーが同じ作品に複数回ブックマークできないようにバリデーション
  validates :user_id, uniqueness: { scope: :work_id }
end