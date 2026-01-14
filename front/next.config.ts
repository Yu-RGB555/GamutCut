import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withPWAInit from "@ducanh2912/next-pwa"

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    skipWaiting: true,
    exclude: [
      // 以下のファイルは存在しないため、ビルド時にキャッシュ対象として認識しないように除外
      /\/_next\/dynamic-css-manifest\.json$/
    ]
  }
});

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

export default withPWA(withNextIntl(nextConfig));
