class Api::V1::PresetsController < ApplicationController
  before_action :authenticate_user!, only: [:create, :index, :destroy]

  def index
    @presets = current_user.presets
    render json: {
      presets: @presets.map do |preset|
        {
          id: preset.id,
          name: preset.name,
          mask_data: preset.mask_data,
          created_at: preset.created_at,
          updated_at: preset.updated_at
        }
      end
    }
  end

  def create
    @preset = current_user.presets.build(preset_params)

    if @preset.save
      render json: {
        id: @preset.id,
        name: @preset.name,
        mask_data: @preset.mask_data,
        created_at: @preset.created_at,
        updated_at: @preset.updated_at
      }, status: :created
    else
      render json: { errors: @preset.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @preset = current_user.presets.find(params[:id])
    @preset.destroy
    head :no_content
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
end