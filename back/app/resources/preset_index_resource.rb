class PresetIndexResource < BaseResource
  root_key :presets

  attributes :id, :name, :mask_data, :created_at, :updated_at
end