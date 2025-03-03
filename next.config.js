/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 如果需要配置环境变量，可以在这里添加
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // 如果需要配置图片域名，可以在这里添加
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
