import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
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
    // IndexNow key file: /<32-hex-key>.txt -> route handler (key from env).
    return [{ source: '/:key([a-f0-9]{32}).txt', destination: '/api/indexnow/key?key=:key' }]
  },
}

export default nextConfig
