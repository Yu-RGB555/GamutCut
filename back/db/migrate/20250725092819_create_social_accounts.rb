class CreateSocialAccounts < ActiveRecord::Migration[7.2]
  def change
    create_table :social_accounts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :provider, null: false
      t.string :provider_user_id, null: false
      t.text :access_token
      t.text :refresh_token
      t.datetime :token_expires_at
      t.string :scope
      t.jsonb :provider_data
      t.boolean :is_active, default: true, null: false
      t.datetime :last_login_at

      t.timestamps
    end
  end
end
