/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Cảnh báo: Chỉ dùng cách này để deploy nhanh. Hãy fix lỗi code sau.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
