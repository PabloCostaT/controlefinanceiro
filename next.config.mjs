/** @type {import('next').NextConfig} */
const nextConfig = {
// Permite saída standalone para Docker/Serverless
output: 'standalone',

// Manter regras de lint e TS como estavam
eslint: {
  ignoreDuringBuilds: true,
},
typescript: {
  ignoreBuildErrors: true,
},

// Pacotes externos permitidos nos Server Components
serverExternalPackages: [],

// Otimização de imagens
images: {
  unoptimized: true,
},

// Security headers
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ]
},

// Redirects
async redirects() {
  return [
    {
      source: '/home',
      destination: '/',
      permanent: true,
    },
  ]
},

// Environment variables
env: {
  CUSTOM_KEY: process.env.CUSTOM_KEY,
},
}

export default nextConfig
