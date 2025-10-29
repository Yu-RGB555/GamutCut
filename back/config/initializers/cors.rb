Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    case Rails.env
    when 'production'
      origins [
        'https://gamutcut.com',                          # 独自ドメイン（メイン）
        'https://www.gamutcut.com',                      # 独自ドメイン（www）
        'https://gamut-cut.vercel.app',                  # Vercelデフォルトドメイン
        /\Ahttps:\/\/gamut-cut-.*\.vercel\.app\z/,       # プレビューデプロイ用
        /\Ahttps:\/\/gamut-.*\.vercel\.app\z/            # 追加のVercelドメイン
      ]
    when 'development'
      origins 'http://localhost:3003'
    end

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end