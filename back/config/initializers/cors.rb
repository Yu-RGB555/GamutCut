Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    case Rails.env
    when 'production'
      origins 'https://gamut-cut.vercel.app'
    when 'staging'
      origins /\Ahttps:\/\/gamut-cut.*\.vercel\.app\z/
    when 'development'
      origins 'http://localhost:3003'
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end