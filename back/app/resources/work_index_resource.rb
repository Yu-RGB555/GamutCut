class WorkIndexResource < BaseResource
  include MinioUrlHelper

  # 配列の場合のroot_keyを設定
  root_key :works

  attributes :id, :title, :set_mask_data

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

  # 相対時間での作成日時
  attribute :created_at do |work|
    self.time_ago_in_words_japanese(work.created_at)
  end

  private

  # 日本語での相対時間表示
  def time_ago_in_words_japanese(time)
    diff = Time.current - time

    case diff
    when 0..59
      "#{diff.to_i}秒前"
    when 60..3599
      "#{(diff / 60).to_i}分前"
    when 3600..86399
      "#{(diff / 3600).to_i}時間前"
    when 86400..604799
      "#{(diff / 86400).to_i}日前"
    when 604800..2629743
      "#{(diff / 604800).to_i}週間前"
    when 2629744..31556925
      "#{(diff / 2629744).to_i}ヶ月前"
    else
      "#{(diff / 31556926).to_i}年前"
    end
  end
end
