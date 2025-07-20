class Work < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true  # プリセットが削除されても作品は残る

  has_one_attached :illustration_image

  validates :title, presence: true, length: { maximum: 30 }
  validates :description, length: { maximum: 300 }
  validates :set_mask_data, presence: true

  enum :is_public, { published: 0, restricted: 1, draft: 2 }

  # set_mask_dataの実装（プリセットから独立してマスクデータを保存）
  # def save_mask_data_from_preset
  #   if preset.present?
  #     self.set_mask_data = preset.mask_data
  #   end
  # end

  # set_mask_dataのデフォルト値を設定
  # after_initialize :set_default_mask_data, if: :new_record?

  # private

  # def set_default_mask_data
  #   self.set_mask_data ||= {
  #     maskId: 'default_mask',
  #     maskName: 'デフォルトマスク',
  #     maskSettings: {
  #       opacity: 1.0,
  #       blendMode: 'normal'
  #     },
  #     createdAt: Time.current.iso8601
  #   }
  # end
end