class Api::V1::PresetsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :update, :index, :destroy]

  def index
    @presets = current_user.presets

    render json: { presets: PresetIndexResource.new(@presets) }
  end

  def create
    @preset = current_user.presets.build(preset_params)

    if @preset.save
      render json: {
        message: I18n.t('api.preset.create.success')
      }, status: :created
    else
      render json: {
        errors: @preset.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def update
    @preset = current_user.presets.find(params[:id])
    if @preset.update(update_params)
      render json: {
        message: I18n.t('api.preset.update.success')
      }, status: :ok
    else
      render json: {
        message: I18n.t('api.preset.update.failure')
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @preset = current_user.presets.find(params[:id])
    @preset.destroy
    render json: { message: I18n.t('api.preset.destroy.success') }
  end

  private

  def preset_params
    params.require(:preset).permit(
      :name,
      mask_data: [
        :value,
        { masks: [ { originalPoints: [ :x, :y ] }, :scale ] }
      ]
    )
  end

  def update_params
    params.permit(:name)
  end
end