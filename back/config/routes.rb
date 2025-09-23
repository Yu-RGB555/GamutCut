Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions]

  # Health check endpoints
  get '/health', to: 'health_check#index'
  get '/health/detailed', to: 'health_check#detailed'

  # Omniauthコールバック用ルーティング
  get '/auth/:provider/callback', to: 'api/omniauth_callbacks#create'

  namespace :api do
    devise_scope :user do
      get '/users/me', to: 'users#me'
      post 'users/sign_up', to: 'registrations#create'
      post 'users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
    end

    # ユーザー関連エンドポイント（認証関連以外）
    resources :users, only: [:show] do
      member do
        get :works        # /api/users/:id/works - マイページ（公開済み作品一覧）
        get :liked_works  # /api/users/:id/liked_works - マイページ（いいねした作品一覧）
        get :bookmarks    # /api/users/:id/bookmarks - マイページ（ブックマークした作品一覧）
      end
    end

    namespace :v1 do
      resources :works, only: [:index, :show, :create, :update, :destroy] do
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
    end
  end
end