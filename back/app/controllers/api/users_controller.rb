class Api::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:me, :liked_works, :bookmarks]
  before_action :set_user, only: [:show, :works, :liked_works, :bookmarks]

  # GET /api/users/me
  def me
    render json: { user: UserResource.new(current_user) }
  end

  # プロフィール（GET /api/users/:id）
  def show
    render json: { user: UserResource.new(@user) }
  end

  # マイページで表示する作品（GET /api/users/:id/works）
  def works
    # タブ項目「公開作品」「下書き」の判定
    is_public = params[:is_public]

    # 作品表示制御
    if @user == current_user
      # 自分の作品一覧
      user_works = @user.works.where(is_public: is_public)
    else
      # 他人の作品一覧（公開作品のみ）
      user_works = @user.works.where(is_public: '0')
    end

    # 公開作品一覧（ユーザー情報を含ませる）
    works_with_user = user_works.includes(:user).order(created_at: :desc)

    render json: { works: WorkIndexResource.new(works_with_user) }
  end

  # GET /api/users/:id/liked_works
  def liked_works
    # いいねした作品の取得実装
  end

  # GET /api/users/:id/bookmarks
  def bookmarks
    # ブックマークした作品の取得実装
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'ユーザーが見つかりません' }, status: :not_found
  end
end