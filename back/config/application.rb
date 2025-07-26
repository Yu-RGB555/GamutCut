require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module GamutCut
  class Application < Rails::Application
    config.load_defaults 7.2
    config.autoload_lib(ignore: %w[assets tasks])
    config.api_only = true

    # セッションとクッキーを有効化
    config.session_store :cookie_store, key: '_app_session'
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options

    Rails.application.config.middleware.use OmniAuth::Builder do
      provider :google_oauth2,
              ENV['GOOGLE_CLIENT_ID'],
              ENV['GOOGLE_CLIENT_SECRET'],
              {
                scope: 'email,profile',
                prompt: 'select_account',
                image_aspect_ratio: 'square',
                image_size: 50
              }

      provider :twitter,
              ENV['TWITTER_API_KEY'],
              ENV['TWITTER_API_SECRET'],
              {
                secure_image_url: true,
                image_size: 'bigger'
              }
    end
  end
end
