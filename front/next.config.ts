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
      // 本番で配信されない（404になる）ため、precache対象から除外
      // ※excludeは「/_next/」プレフィックスが付く前のアセット名に対して評価されるため、末尾一致で書く
      /dynamic-css-manifest\.json$/
    ]
  }
});

const nextConfig: NextConfig = {
  /* config options here */
};

const withNextIntl = createNextIntlPlugin();

export default withPWA(withNextIntl(nextConfig));
