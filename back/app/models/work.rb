class Work < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true  # プリセットが削除されても作品は残る
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user

  has_one_attached :illustration_image

  validates :title, presence: true, length: { maximum: 30 }
  validates :description, length: { maximum: 300 }
  validates :set_mask_data, presence: true
  validates :illustration_image, presence: true
  validate :illustration_image_size

  enum :is_public, { published: 0, restricted: 1, draft: 2 }

  private

  def illustration_image_size
    return unless illustration_image.attached?

    max_size = 16.megabytes
    if illustration_image.byte_size > max_size
      errors.add(:illustration_image, :too_large, capacity: (max_size / 1.megabyte).to_i)
    end
  end
end