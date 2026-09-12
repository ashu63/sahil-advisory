import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

// PostHog ingest is proxied through /ingest so first-party cookies work and
// blockers keyed on posthog.com do not drop events. Its endpoints end in a
// slash (/e/, /decide/), which Next would otherwise strip with a redirect.
const POSTHOG_ASSETS = process.env.NEXT_PUBLIC_POSTHOG_ASSETS_HOST || 'https://us-assets.i.posthog.com'
const POSTHOG_API = process.env.NEXT_PUBLIC_POSTHOG_API_HOST || 'https://us.i.posthog.com'

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  // OG cards render with vendored Geist TTFs read off disk. They are generated
  // at build time today, but standalone output would not trace a plain
  // readFile, so an OG route that ever revalidates would 500 without this.
  outputFileTracingIncludes: {
    '/**': ['./assets/fonts/**'],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async rewrites() {
    return [
      // IndexNow key file: /<32-hex-key>.txt -> route handler (key from env).
      { source: '/:key([a-f0-9]{32}).txt', destination: '/api/indexnow/key?key=:key' },
      // PostHog reverse proxy. Order matters: static assets first.
      { source: '/ingest/static/:path*', destination: `${POSTHOG_ASSETS}/static/:path*` },
      { source: '/ingest/array/:path*', destination: `${POSTHOG_ASSETS}/array/:path*` },
      { source: '/ingest/:path*', destination: `${POSTHOG_API}/:path*` },
    ]
  },
}

export default nextConfig
