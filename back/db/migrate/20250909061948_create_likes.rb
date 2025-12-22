class CreateLikes < ActiveRecord::Migration[7.2]
  def change
    create_table :likes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :work, null: false, foreign_key: true

      t.timestamps
    end

    # 同じユーザーが同じ作品に複数回いいねできないようにユニーク制約を追加
    add_index :likes, [ :user_id, :work_id ], unique: true
  end
end
