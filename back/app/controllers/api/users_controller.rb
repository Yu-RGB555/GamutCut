class Api::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:me, :show_profile, :update_profile, :liked_works, :bookmarks]
  before_action :set_user, only: [:show, :works, :liked_works, :bookmarks]

  # GET /api/users/me
  def me
    render json: { user: UserResource.new(current_user) }
  end

  # プロフィール (GET /api/users/profile)
  def show_profile
    render json: UserResource.new(current_user).serializable_hash
  end

  # プロフィール更新（PATCH /api/users/profile）
  def update_profile
    if current_user.update(profile_params)
      render json: {
        message: "プロフィールを更新しました",
        user: UserResource.new(current_user).serializable_hash
      }
    else
      render json: {
        message: "プロフィールの更新に失敗しました",
        errors: current_user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # 特定ユーザープロフィール（GET /api/users/:id）
  def show
    render json: { user: UserResource.new(@user) }
  end

  # マイページ（公開作品・下書きタブ）で表示する作品（GET /api/users/:id/works）
  def works
    # タブ項目「公開作品」「下書き」の判定
    is_public = params[:is_public]

    # 作品表示制御
    if @user == current_user
      # 自分の作品一覧（公開作品・下書き両対応）
      user_works = @user.works.where(is_public: is_public)
    else
      # 他人の作品一覧（公開作品のみ）
      user_works = @user.works.where(is_public: '0')
    end

    # 公開作品一覧（ユーザー情報を含ませる）
    works_with_user = user_works.includes(:user).order(created_at: :desc)

    render json: { works: WorkIndexResource.new(works_with_user).serializable_hash }
  end

  # GET /api/users/:id/liked_works
  def liked_works
    # マイページのいいね一覧（他人からのアクセスは制限する）
    if @user != current_user
      render json: { error: 'アクセス権限がありません' }, status: :forbidden
      return
    end

    # いいねした作品一覧を取得（公開作品のみ）
    liked_works = @user.liked_works.where(is_public: 'published').includes(:user).order('likes.created_at DESC')

    render json: { works: WorkIndexResource.new(liked_works, current_user: current_user).serializable_hash }
  end

  # GET /api/users/:id/bookmarks
  def bookmarks
    # マイページのブックマーク一覧（他人からのアクセスは制限する）
		if @user != current_user
			render json: { error: 'アクセス権限がありません' }, status: :forbidden
			return
		end

		bookmarked_works = @user.bookmarked_works.where(is_public: 'published').includes(:user).order('bookmarks.created_at DESC')

		render json: {
      works: WorkIndexResource.new(bookmarked_works, current_user: current_user).serializable_hash
    }
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'ユーザーが見つかりません' }, status: :not_found
  end

  def profile_params
    params.require(:user).permit(:name, :avatar, :bio, :x_account_url)
  end
end