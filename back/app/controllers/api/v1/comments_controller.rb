class Api::V1::CommentsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  before_action :authenticate_user_optional!, only: [:index, :show]
  before_action :set_work, only: [:index, :create]
  before_action :set_comment, only: [:show, :update, :destroy]
  before_action :check_comment_owner, only: [:update, :destroy]

  # GET /api/v1/works/:work_id/comments
  def index
    @comments = @work.comments.includes(:user).order(created_at: :desc)

    render json: CommentResource.new(@comments).serializable_hash
  end

  # POST /api/v1/works/:work_id/comments
  def create
    @comment = @work.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      render json: {
        message: 'コメントを投稿しました',
        comment: CommentResource.new(@comment).serializable_hash
      }, status: :created
    else
      render json: {
        errors: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # GET /api/v1/comments/:id (通知機能用の単体コメント取得)
  def show
    render json: CommentDetailResource.new(@comment).serializable_hash
  end

  # PATCH/PUT /api/v1/works/:work_id/comments/:id
  def update
    if @comment.update(comment_params)
      render json: {
        message: 'コメントを更新しました',
        comment: CommentResource.new(@comment).serializable_hash
      }
    else
      render json: {
        errors: @comment.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/works/:work_id/comments/:id
  def destroy
    @comment.destroy
    render json: {
      message: 'コメントを削除しました'
    }
  end

  private

  # オプショナル認証: 未ログインでもアクセス可能
  def authenticate_user_optional!
    true
  end

  def set_work
    @work = Work.find(params[:work_id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: '作品が見つかりません' }, status: :not_found
  end

  def set_comment
    if params[:work_id]
      # ネストしたルート経由の場合：/api/v1/works/:work_id/comments/:id
      @work = Work.find(params[:work_id])
      @comment = @work.comments.find(params[:id])
    else
      # 単体ルート経由の場合：/api/v1/comments/:id（通知機能用）
      @comment = Comment.includes(:work, :user).find(params[:id])
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'コメントが見つかりません' }, status: :not_found
  end

  def check_comment_owner
    unless @comment.user == current_user
      render json: {
        error: 'このコメントを編集・削除する権限がありません'
      }, status: :forbidden
    end
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end