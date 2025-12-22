# app/controllers/health_check_controller.rb
class HealthCheckController < ApplicationController
  skip_before_action :authenticate_user_from_token!

  def index
    render json: {
      status: "ok",
      timestamp: Time.current,
      environment: Rails.env
    }
  end

  def detailed
    begin
      # データベース接続チェック（読み取り専用）
      db_status = check_database_connection

      # 基本的なアプリケーション状態
      app_status = {
        rails_version: Rails.version,
        ruby_version: RUBY_VERSION,
        environment: Rails.env,
        timestamp: Time.current
      }

      render json: {
        status: "ok",
        application: app_status,
        database: db_status,
        checks: perform_health_checks
      }
    rescue => e
      render json: {
        status: "error",
        error: e.message,
        timestamp: Time.current
      }, status: 500
    end
  end

  private

  def check_database_connection
    connection = ActiveRecord::Base.connection
    {
      connected: true,
      database_name: connection.current_database,
      adapter: connection.adapter_name,
      tables_exist: {
        users: ActiveRecord::Base.connection.table_exists?("users"),
        schema_migrations: ActiveRecord::Base.connection.table_exists?("schema_migrations")
      },
      record_counts: {
        users: User.count
      }
    }
  rescue => e
    {
      connected: false,
      error: e.message
    }
  end

  def perform_health_checks
    checks = {}

    # 1. データベース読み取りテスト
    checks[:database_read] = begin
      User.limit(1).count
      { status: "ok", message: "Database read successful" }
    rescue => e
      { status: "error", message: e.message }
    end

    # 2. 環境変数チェック
    checks[:environment_variables] = {
      database_url_present: ENV["DATABASE_URL"].present?,
      rails_env: ENV["RAILS_ENV"],
      rack_env: ENV["RACK_ENV"]
    }

    # 3. マイグレーション状態チェック
    checks[:migrations] = begin
      needs_migration = ActiveRecord::MigrationContext.new(
        ActiveRecord::Migrator.migrations_paths
      ).needs_migration?

      {
        status: needs_migration ? "pending" : "up_to_date",
        needs_migration: needs_migration
      }
    rescue => e
      { status: "error", message: e.message }
    end

    checks
  end
end
