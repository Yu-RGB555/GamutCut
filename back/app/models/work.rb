class Work < ApplicationRecord
  belongs_to :user
  belongs_to :preset, optional: true  # プリセットが削除されても作品は残る
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :bookmarks, dependent: :destroy
  has_many :bookmarked_works, through: :bookmarks, source: :user
  has_many :work_tags, dependent: :destroy
  has_many :tags, through: :work_tags
  has_many :comments, dependent: :destroy

  has_one_attached :illustration_image

  # 公開・限定公開の場合のみ必須
  validates :title, presence: true, length: { maximum: 30 }, unless: :draft?
  validates :set_mask_data, presence: true, unless: :draft?
  validates :illustration_image, presence: true, unless: :draft?

  # 下書きも含めて常に適用されるバリデーション
  validates :title, length: { maximum: 30 }, if: :draft?
  validates :description, length: { maximum: 300 }
  validate :illustration_image_size

  enum :is_public, { published: 0, restricted: 1, draft: 2 }

  # Ransackで検索可能な属性を明示的に定義
  def self.ransackable_attributes(auth_object = nil)
    ["title", "description", "created_at", "updated_at", "user_id", "is_public"]
  end

  # Ransackで検索可能な情報（ユーザーとタグ）を許可するためにモデルを指定
  def self.ransackable_associations(auth_object = nil)
    ["user", "tags"]
  end

  # 複合キーワード検索用のカスタムスコープ
  def self.ransackable_scopes(auth_object = nil)
    [:multi_keyword_search]
  end

  # 複数キーワードで作品名とユーザー名を横断検索するスコープ
  def self.multi_keyword_search(query)
    return all if query.blank?

    keywords = query.split(/[\s　]+/).reject(&:blank?)
    return all if keywords.empty?

    # 各キーワードに対して作品名またはユーザー名のいずれかにマッチする条件を作成
    conditions = keywords.map do |keyword|
      <<-SQL
        (works.title ILIKE ? OR users.name ILIKE ?)
      SQL
    end

    # 全てのキーワードが満たされる必要がある（AND条件）
    joins(:user).where(conditions.join(' AND '), *keywords.flat_map { |k| ["%#{k}%", "%#{k}%"] })
  end

  private

  def illustration_image_size
    return unless illustration_image.attached?

    max_size = 16.megabytes
    if illustration_image.byte_size > max_size
      errors.add(:illustration_image, :too_large, capacity: (max_size / 1.megabyte).to_i)
    end
  end
end