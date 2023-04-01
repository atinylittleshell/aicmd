/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['aicmd-shared'],
  experimental: {
    appDir: true,
    typedRoutes: true,
  }
}

module.exports = nextConfig;
