# lib/tasks/connection_check.rake
namespace :db do
  desc "Check database connections and environment setup (read-only)"
  task connection_check: :environment do
    puts "=== Database Connection Check ==="
    puts "Environment: #{Rails.env}"
    puts "Time: #{Time.current}"
    puts

    begin
      # 1. データベース接続確認
      puts "1. Database Connection Status:"
      connection = ActiveRecord::Base.connection
      db_name = connection.current_database
      puts "✓ Connected to database: #{db_name}"
      puts "✓ Connection adapter: #{connection.adapter_name}"
      puts "✓ Connection pool size: #{ActiveRecord::Base.connection_pool.size}"

      # 2. 現在のデータベース名が期待通りかチェック
      expected_db = case Rails.env
      when "staging"
                      "gamut_cut_db_preview"
      when "production"
                      "gamut_cut_db"
      else
                      "unknown"
      end

      if db_name == expected_db
        puts "✓ Database name matches expected: #{expected_db}"
      else
        puts "⚠ Database name mismatch! Expected: #{expected_db}, Actual: #{db_name}"
      end

      # 3. テーブル存在確認（users テーブルのみ）
      puts "\n2. Table Structure Check:"
      if ActiveRecord::Base.connection.table_exists?("users")
        puts "✓ Users table exists"

        # スキーマ情報の確認（読み取り専用）
        columns = User.column_names
        puts "✓ Users table columns: #{columns.join(', ')}"

        # レコード数の確認（読み取り専用）
        user_count = User.count
        puts "✓ Users table record count: #{user_count}"
      else
        puts "⚠ Users table does not exist"
      end

      # 4. 環境変数の確認
      puts "\n3. Environment Variables Check:"
      puts "✓ DATABASE_URL: #{ENV['DATABASE_URL'] ? 'Present' : 'Not set'}"
      puts "✓ RAILS_ENV: #{ENV['RAILS_ENV'] || 'Not set'}"
      puts "✓ RACK_ENV: #{ENV['RACK_ENV'] || 'Not set'}"

      # 5. マイグレーション状態の確認
      puts "\n4. Migration Status Check:"
      if ActiveRecord::Base.connection.table_exists?("schema_migrations")
        pending_migrations = ActiveRecord::MigrationContext.new(
          ActiveRecord::Migrator.migrations_paths
        ).needs_migration?

        if pending_migrations
          puts "⚠ There are pending migrations"
        else
          puts "✓ All migrations are up to date"
        end
      else
        puts "⚠ Schema migrations table does not exist"
      end

      puts "\n=== Connection Check Completed Successfully ==="

    rescue => e
      puts "\n❌ Connection Check Failed:"
      puts "Error: #{e.message}"
      puts "Backtrace:"
      puts e.backtrace.first(5).join("\n")
    end
  end
end
