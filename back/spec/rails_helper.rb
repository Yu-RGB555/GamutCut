# This file is copied to spec/ when you run 'rails generate rspec:install'
require 'spec_helper'

# CRITICAL: Force test environment to prevent accidental data loss
ENV['RAILS_ENV'] = 'test'

require_relative '../config/environment'

# Prevent database truncation if the environment is production OR development
abort("The Rails environment is running in production mode!") if Rails.env.production?
abort("CRITICAL: Test is running in development environment! This could cause data loss!") if Rails.env.development?

# Ensure we're actually in test environment
unless Rails.env.test?
  abort("CRITICAL: Rails environment is '#{Rails.env}' but should be 'test'. Aborting to prevent data loss!")
end

require 'rspec/rails'

# Add additional requires below this line. Rails is not loaded until this point!
require 'factory_bot_rails'
require 'shoulda/matchers'
require 'database_cleaner/active_record'

# Requires supporting ruby files with custom matchers and macros, etc, in
# spec/support/ and its subdirectories. Files matching `spec/**/*_spec.rb` are
# run as spec files by default. This means that files in spec/support that end
# in _spec.rb will both be required and run as specs, causing the specs to be
# run twice. It is recommended that you do not name files matching this glob to
# end with _spec.rb. You can configure this pattern with the --pattern
# option on the command line or in ~/.rspec, .rspec or `.rspec-local`.
#
# The following line is provided for convenience purposes. It has the downside
# of increasing the boot-up time by auto-requiring all files in the support
# directory. Alternatively, in the individual `*_spec.rb` files, manually
# require only the support files necessary.
#
Dir[Rails.root.join('spec', 'support', '**', '*.rb')].sort.each { |f| require f }

# Checks for pending migrations and applies them before tests are run.
# If you are not using ActiveRecord, you can remove these lines.
begin
  ActiveRecord::Migration.maintain_test_schema!
rescue ActiveRecord::PendingMigrationError => e
  abort e.to_s.strip
end

RSpec.configure do |config|
  # We're using FactoryBot instead of fixtures, so fixture_path is not needed

  # If you're not using ActiveRecord, or you'd prefer not to run each of your
  # examples within a transaction, remove the following line or assign false
  # instead of true.
  config.use_transactional_fixtures = true

  # You can uncomment this line to turn off ActiveRecord support entirely.
  # config.use_active_record = false

  # RSpec Rails can automatically mix in different behaviours to your tests
  # based on their file location, for example enabling you to call `get` and
  # `post` in specs under `spec/controllers`.
  #
  # You can disable this behaviour by removing the line below, and instead
  # explicitly tag your specs with their type, e.g.:
  #
  #     RSpec.describe UsersController, type: :controller do
  #       # ...
  #     end
  #
  # The different available types are documented in the features, such as in
  # https://rspec.info/features/6-0/rspec-rails
  config.infer_spec_type_from_file_location!

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
  # arbitrary gems may also be filtered via:
  # config.filter_gems_from_backtrace("gem name")

  # Factory Bot configuration
  config.include FactoryBot::Syntax::Methods

  # Devise helpers for controller tests
  config.include Devise::Test::ControllerHelpers, type: :controller
  config.include Devise::Test::IntegrationHelpers, type: :request

  # Database cleaner configuration - SAFE SETTINGS
  config.before(:suite) do
    # Only allow database cleaning in test environment
    unless Rails.env.test?
      abort("CRITICAL: Attempting to run database cleaner in '#{Rails.env}' environment!")
    end

    # Verify we're connected to test database
    db_name = ActiveRecord::Base.connection.current_database
    unless db_name.include?('test') || db_name.include?('_test')
      abort("CRITICAL: Connected to database '#{db_name}' which doesn't appear to be a test database!")
    end

    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    # Double-check environment before each test
    unless Rails.env.test?
      abort("CRITICAL: Test trying to run in '#{Rails.env}' environment!")
    end

    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end
end

# Shoulda Matchers configuration
Shoulda::Matchers.configure do |config|
  config.integrate do |with|
    with.test_framework :rspec
    with.library :rails
  end
end