class CreateWorks < ActiveRecord::Migration[7.2]
  def change
    create_table :works do |t|
      t.references :user, null: false, foreign_key: true
      t.references :preset, null: true, foreign_key: true
      t.string :title, null: false
      t.string :illustration_image
      t.jsonb :set_mask_data, null: false
      t.text :description
      t.integer :is_public, default: 0, null: false

      t.timestamps
    end
  end
end
