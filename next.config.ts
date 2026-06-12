import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.simpaisa.com',
      },
    ],
  },
  output: 'standalone',
  distDir: 'out',
  basePath: process.env.NEXT_PUBLIC_SUB_PATH,
};

export default nextConfig;
