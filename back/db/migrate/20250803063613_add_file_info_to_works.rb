class AddFileInfoToWorks < ActiveRecord::Migration[7.2]
  def change
    add_column :works, :filename, :string
    add_column :works, :filesize, :integer
  end
end
