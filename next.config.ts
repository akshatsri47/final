import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allows all domains
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)", // Adjust this path based on where your auth routes are
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" }, // Optional
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google-analytics.com https://mercury-t2.phonepe.com https://dgq88cldibal5.cloudfront.net https://mercurystatic.phonepe.com https://linchpin.phonepe.com https://mercury.phonepe.com; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
