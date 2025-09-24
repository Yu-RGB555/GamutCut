class WorkShowResource < BaseResource
  include MinioUrlHelper

  # 単一オブジェクトの場合はroot_keyは不要
  # root_key :work

  attributes :id, :title, :set_mask_data, :description, :is_public, :filename, :filesize

  # いいね数
  attribute :likes_count do |work|
    work.likes.count
  end

  # いいねした作品
  attribute :is_liked_by_current_user do |work|
    current_user = @current_user
    current_user ? current_user.likes.exists?(work: work) : false
  end

  # ブックマークした作品
  attribute :is_bookmarked_by_current_user do |work|
    current_user = @current_user
    current_user ? current_user.bookmarks.exists?(work: work) : false
  end

  # 付与したタグ
  attribute :tags do |work|
    work.tags.map do |tag|
      {
        id: tag.id,
        name: tag.name
      }
    end
  end

  # カスタム属性: illustration_image_url
  attribute :illustration_image_url do |work|
    if work.illustration_image.attached?
      WorkIndexResource.minio_direct_url(work.illustration_image)
    else
      nil
    end
  end

  # ネストした user オブジェクト
  attribute :user do |work|
    {
      id: work.user.id,
      name: work.user.name,
      avatar_url: work.user.avatar_url
    }
  end

  # フォーマット済みの作成日時
  attribute :created_at do |work|
    work.created_at.strftime("%Y年%-m月%-d日 %H:%M")
  end

  private

  # initializeをオーバーライドしてcurrent_userを保存
  def initialize(resource, current_user: nil, **options)
    @current_user = current_user
    super(resource, **options)
  end
end