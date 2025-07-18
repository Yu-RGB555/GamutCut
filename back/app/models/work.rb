class Work < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true  # プリセットが削除されても作品は残る

  validates :title, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 1000 }
  validates :is_public, inclusion: { in: [0, 1, 2] }
  validates :set_mask_data, presence: true  # マスクデータは必須

  enum is_public: { published: 0, restricted: 1, draft: 2 }

end