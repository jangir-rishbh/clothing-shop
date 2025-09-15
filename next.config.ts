import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "connect-src 'self' https://api.supabase.com http://localhost:8000 https://auth.supabase.io ws://localhost:8000 wss://localhost:8000 https://*.supabase.co wss://*.supabase.co https://*.hcaptcha.com https://cdn-global.configcat.com https://configcat.supabase.com https://*.stripe.com https://*.stripe.network https://www.cloudflare.com https://*.vercel-insights.com https://api.github.com https://raw.githubusercontent.com https://frontend-assets.supabase.com https://*.usercentrics.eu https://ss.supabase.com https://maps.googleapis.com https://ph.supabase.com wss://*.pusher.com https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io https://cdnjs.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "worker-src 'self' blob:",
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "media-src 'self' data:"
            ].join('; ')
          }
        ]
      }
    ]
  }
};

export default nextConfig;
