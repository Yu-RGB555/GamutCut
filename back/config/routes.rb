Rails.application.routes.draw do
  devise_for :users, skip: [:registrations]

  namespace :api do
    devise_scope :user do
      post 'users/sign_up', to: 'registrations#create'
    end
  end
end