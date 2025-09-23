class CreateWorkTags < ActiveRecord::Migration[7.2]
  def change
    create_table :work_tags do |t|
      t.references :work, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
    # 1つの作品に対し、同一のタグを付けられないようにするユニーク制約
    add_index :work_tags, [:work_id, :tag_id], unique: true
  end
end
