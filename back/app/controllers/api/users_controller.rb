class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: { user: current_user }
  end
end