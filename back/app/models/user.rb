class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :works, dependent: :restrict_with_exception  # 作品がある場合は退会不可
  has_many :presets, dependent: :destroy

  validates :name, presence: true, length: { maximum: 50 }
end
