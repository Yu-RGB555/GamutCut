class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :works, dependent: :restrict_with_exception  # 作品がある場合は退会不可
  has_many :presets, dependent: :destroy

  validates :name, presence: true, length: { maximum: 20 }
  validates :password, format: { with: /\A[a-zA-Z0-9]+\z/ }, if: :password_required?
  validates :bio, length: { maximum: 300 }
  # validates :x_account_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) }, allow_blank: true

  private

  def password_required?
    !persisted? || !password.nil? || !password_confirmation.nil?
  end
end
