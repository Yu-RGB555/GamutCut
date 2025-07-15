class AddCustomFieldsToUsers < ActiveRecord::Migration[7.2]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :avatar_url, :string
    add_column :users, :bio, :text
    add_column :users, :x_account_url, :string
  end
end
