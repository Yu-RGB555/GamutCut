class Preset < ApplicationRecord
  belongs_to :user
  has_many :works, dependent: :nullify  # プリセット削除時はWorksのpreset_idをnullにする

  validates :name, presence: true, length: { maximum: 30 }
  validates :mask_data, presence: true

end