Rails.application.routes.draw do
  # Health check endpoints
  get '/health', to: 'health_check#index'
  get '/health/detailed', to: 'health_check#detailed'

  devise_for :users, skip: [:registrations, :sessions]

  namespace :api do
    devise_scope :user do
      post 'users/sign_up', to: 'registrations#create'
      post 'users/sign_in', to: 'sessions#create'
      delete 'users/sign_out', to: 'sessions#destroy'
    end
  end
end