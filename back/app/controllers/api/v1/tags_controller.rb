class Api::V1::TagsController < ApplicationController
  def index
    @tags = Tag.joins(work_tags: :work)
              .where(works: { is_public: 0 })
              .group("tags.id")
              .order(:name)
              .select("tags.*")

    render json: {
      tags: @tags
    }
  end

  def popular
    # 登録数が多い順TOP8まで
    limit = params[:limit]&.to_i || 8

    # 公開済み作品のタグのみを対象に、使用回数をカウントして多い順に取得
    @popular_tags = Tag.joins(work_tags: :work)
                      .where(works: { is_public: 0 })
                      .group("tags.id")
                      .order("COUNT(work_tags.tag_id) DESC")
                      .limit(limit)
                      .select("tags.*, COUNT(work_tags.tag_id) as works_count")

    render json: {
      tags: @popular_tags.map do |tag|
        {
          id: tag.id,
          name: tag.name,
          works_count: tag.works_count
        }
      end
    }
  end
end
