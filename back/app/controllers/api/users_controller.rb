class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: { 
      user: {
        id: current_user.id,
        name: current_user.name,
        email: current_user.email,
        avatar_url: current_user.avatar_url
      }
    }
  end
end