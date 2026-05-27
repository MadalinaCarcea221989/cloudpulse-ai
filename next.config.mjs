/** @type {import('next').NextConfig} */
const isTest = process.env.NODE_ENV === 'test' || process.env.PLAYWRIGHT_TEST === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: isTest,
  },
};

export default nextConfig;