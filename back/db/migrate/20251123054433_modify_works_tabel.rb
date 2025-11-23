class ModifyWorksTabel < ActiveRecord::Migration[7.2]
  def change
    change_column_null :works, :title, true
    change_column_null :works, :set_mask_data, true
    remove_column :works, :illustration_image, :string
  end
end
