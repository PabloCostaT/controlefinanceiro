/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  serverExternalPackages: [],

  images: { unoptimized: true },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ]
  },

  async redirects() {
    return [{ source: '/home', destination: '/', permanent: true }]
  },

  env: { CUSTOM_KEY: process.env.CUSTOM_KEY },
}

export default nextConfig
