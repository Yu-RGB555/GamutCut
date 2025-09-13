# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_09_13_125512) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "bookmarks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "work_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "work_id"], name: "index_bookmarks_on_user_id_and_work_id", unique: true
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
    t.index ["work_id"], name: "index_bookmarks_on_work_id"
  end

  create_table "likes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "work_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "work_id"], name: "index_likes_on_user_id_and_work_id", unique: true
    t.index ["user_id"], name: "index_likes_on_user_id"
    t.index ["work_id"], name: "index_likes_on_work_id"
  end

  create_table "presets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.jsonb "mask_data", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_presets_on_user_id"
  end

  create_table "shape_templates", force: :cascade do |t|
    t.string "shape_type", null: false
    t.jsonb "shape_data", null: false
    t.integer "display_order", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["display_order"], name: "index_shape_templates_on_display_order"
    t.index ["shape_type"], name: "index_shape_templates_on_shape_type"
  end

  create_table "social_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "provider", null: false
    t.string "provider_user_id", null: false
    t.text "access_token"
    t.text "refresh_token"
    t.datetime "token_expires_at"
    t.string "scope"
    t.jsonb "provider_data"
    t.boolean "is_active", default: true, null: false
    t.datetime "last_login_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_social_accounts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", null: false
    t.string "avatar_url"
    t.text "bio"
    t.string "x_account_url"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "works", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "preset_id"
    t.string "title", null: false
    t.string "illustration_image"
    t.jsonb "set_mask_data", null: false
    t.text "description"
    t.integer "is_public", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "filename"
    t.integer "filesize"
    t.index ["preset_id"], name: "index_works_on_preset_id"
    t.index ["user_id"], name: "index_works_on_user_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "bookmarks", "works"
  add_foreign_key "likes", "users"
  add_foreign_key "likes", "works"
  add_foreign_key "presets", "users"
  add_foreign_key "social_accounts", "users"
  add_foreign_key "works", "presets"
  add_foreign_key "works", "users"
end
