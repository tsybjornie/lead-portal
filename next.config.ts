import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  // Disable source maps in production — prevents code inspection
  productionBrowserSourceMaps: false,

  // Security headers — anti-copy, anti-iframe, anti-scrape
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent iframe embedding (stops clone sites)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https:;",
          },
          // Prevent MIME type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Control referrer info sent to external sites
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — limit what features embedded pages can use
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
          // Strict transport security (HTTPS only)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
