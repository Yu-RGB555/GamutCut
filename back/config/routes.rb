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

    namespace :v1 do
      resources :works, only: [:index, :show, :create, :update, :destroy]
      resources :presets, only: [:index, :create, :update, :destroy]
    end
  end
end