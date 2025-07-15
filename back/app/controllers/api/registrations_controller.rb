class Api::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  def create
    build_resource(sign_up_params)

    if resource.save
      render json: {
        message: "ユーザーが正常に作成されました",
        user: {
          id: resource.id,
          name: resource.name,
          email: resource.email
        }
      }, status: :created
    else
      render json: {
        message: "ユーザーの作成に失敗しました",
        errors: resource.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
