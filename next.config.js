/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow production builds to successfully complete even if ESLint errors exist
    ignoreDuringBuilds: false,
  },
  // Enable static optimization
  trailingSlash: false,
  reactStrictMode: true,
}

module.exports = nextConfig