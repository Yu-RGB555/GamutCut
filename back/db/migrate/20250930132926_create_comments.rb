class CreateComments < ActiveRecord::Migration[7.2]
  def change
    create_table :comments do |t|
      t.text :content, null: false
      t.references :work, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    # パフォーマンス向上のためのインデックス
    add_index :comments, [ :work_id, :created_at ]
    add_index :comments, [ :user_id, :created_at ]
  end
end
