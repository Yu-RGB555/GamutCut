Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.production?
      origins 'https://gamut-cut.vercel.app/'
    else
      origins [
        'http://localhost:3003',
        'https://gamut-ja554v8jr-yutaros-projects-00a788f9.vercel.app/'
      ]
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end