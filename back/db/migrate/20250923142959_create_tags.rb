class CreateTags < ActiveRecord::Migration[7.2]
  def change
    create_table :tags do |t|
      t.string :name, null: false

      t.timestamps
    end
    # 同名のタグは作成できないようにするユニーク制約
    add_index :tags, :name, unique: true
  end
end
