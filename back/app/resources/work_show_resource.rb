class WorkShowResource < BaseResource
  include MinioUrlHelper

  # 単一オブジェクトの場合はroot_keyは不要
  # root_key :work

  attributes :id, :title, :set_mask_data, :description, :is_public, :filename, :filesize

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
end