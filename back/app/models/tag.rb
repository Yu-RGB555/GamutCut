class Tag < ApplicationRecord
  has_many :work_tags, dependent: :destroy  # タグ側からの削除も対応する
  has_many :works, through: :work_tags

  validates :name, presence: true, uniqueness: true

  # Ransackで検索可能な属性を明示的に定義
  def self.ransackable_attributes(auth_object = nil)
    [ "name" ]
  end
end
