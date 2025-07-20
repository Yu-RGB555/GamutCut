Rails.application.routes.draw do
  devise_for :users, skip: [:registrations, :sessions]

  # Health check endpoints
  get '/health', to: 'health_check#index'
  get '/health/detailed', to: 'health_check#detailed'

  namespace :api do
    devise_scope :user do
      post 'users/sign_up', to: 'registrations#create'
      post 'users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
    end

    namespace :v1 do
      resources :works, only: [:index, :show, :create, :update, :destroy]
    end
  end
end