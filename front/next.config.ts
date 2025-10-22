import type { NextConfig } from "next";

// 許可するオリジンを環境変数から取得
const getAllowedOrigins = () => {
  const origins = [];

  // 開発環境
  if (process.env.NODE_ENV === 'development') {
    origins.push('localhost:3003', 'localhost:3002');
    return origins;
  }

  // 本番環境のAPI URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
      origins.push(apiUrl.host);
    } catch (error) {
      console.warn('Invalid NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    }
  }

  // フロントエンドのURL
  if (process.env.VERCEL_URL) {
    origins.push(process.env.VERCEL_URL);
  }

  return origins;
};

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // API経由のリクエスト用
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ]
  },
  // 本番環境での外部API通信を許可
  experimental: {
    serverActions: {
      allowedOrigins: getAllowedOrigins()
    }
  }
};

export default nextConfig;
