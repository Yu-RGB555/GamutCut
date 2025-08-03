class Work < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true  # プリセットが削除されても作品は残る

  has_one_attached :illustration_image

  validates :title, presence: true, length: { maximum: 30 }
  validates :description, length: { maximum: 300 }
  validates :set_mask_data, presence: true

  enum :is_public, { published: 0, restricted: 1, draft: 2 }
end