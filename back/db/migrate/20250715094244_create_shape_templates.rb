class CreateShapeTemplates < ActiveRecord::Migration[7.2]
  def change
    create_table :shape_templates do |t|
      t.string :shape_type, null: false
      t.jsonb :shape_data, null: false
      t.integer :display_order, default: 0

      t.timestamps
    end

    add_index :shape_templates, :shape_type
    add_index :shape_templates, :display_order
  end
end
