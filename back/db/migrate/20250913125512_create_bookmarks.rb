class CreateBookmarks < ActiveRecord::Migration[7.2]
  def change
    create_table :bookmarks do |t|
      t.references :user, null: false, foreign_key: true
      t.references :work, null: false, foreign_key: true

      t.timestamps
    end

    # 複合ユニーク制約: 同じユーザーが同じ作品を複数回ブックマークできない
    add_index :bookmarks, [ :user_id, :work_id ], unique: true
  end
end
