Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions]

  # ヘルスチェック
  root 'health_check#index'  # ルートパスをヘルスチェックに設定
  get '/up', to: 'health_check#index'  # Renderのデフォルトヘルスチェック
  get '/health', to: 'health_check#index'
  get '/health/detailed', to: 'health_check#detailed'

  # letter_opener_web用
  mount LetterOpenerWeb::Engine, at: "/letter_opener" if Rails.env.development?

  # Omniauthコールバック用
  get '/auth/:provider/callback', to: 'api/omniauth_callbacks#create'

  namespace :api do
    # 認証関連
    devise_scope :user do
      get '/users/me', to: 'users#me'
      post 'users/sign_up', to: 'registrations#create'
      post 'users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
    end

    # 認証済みユーザー自身のプロフィール関連
    get '/users/profile', to: 'users#show_profile'
    patch '/users/profile', to: 'users#update_profile'

    # メールアドレス変更
    patch '/users/change_email', to: 'users#change_email'

    # パスワードリセット
    post '/password_resets', to: 'password_resets#create'     # リセット要求（メール送信）
    patch '/password_resets/:token', to: 'password_resets#update'  # パスワード更新

    # ユーザー関連エンドポイント（特定ユーザー情報取得用）
    resources :users, only: [:show, :update] do
      member do
        get :works        # /api/users/:id/works - マイページ（公開済み作品一覧）
        get :liked_works  # /api/users/:id/liked_works - マイページ（いいねした作品一覧）
        get :bookmarks    # /api/users/:id/bookmarks - マイページ（ブックマークした作品一覧）
      end
    end

    namespace :v1 do
      resources :works, only: [:index, :show, :create, :update, :destroy] do
        # 作品に紐づくコメント
        resources :comments, only: [:index, :create, :update, :destroy]

        member do
          get :image  # 画像取得用エンドポイント
          post :like    # いいね追加
          delete :like  # いいね削除
          post :bookmark    # ブックマーク追加
          delete :bookmark  # ブックマーク削除
        end
      end

      resources :tags, only: [:index] do
        collection do
          get :popular # 人気タグ
        end
      end

      resources :presets, only: [:index, :create, :update, :destroy]

      # 通知機能用の単体コメント取得
      resources :comments, only: [:show]
    end
  end
end