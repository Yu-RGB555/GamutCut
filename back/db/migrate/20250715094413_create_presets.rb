class CreatePresets < ActiveRecord::Migration[7.2]
  def change
    create_table :presets do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.jsonb :mask_data, null: false

      t.timestamps
    end
  end
end
