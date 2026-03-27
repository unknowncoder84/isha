/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Set custom port
  env: {
    PORT: '3000',
  },
}

export default nextConfig
