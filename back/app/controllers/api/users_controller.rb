class Api::UsersController < ApplicationController
  before_action :authenticate_user!

  def me
    render json: { user: UserResource.new(current_user) }
  end
end