/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-105fec70566540d1a4cf3698e960bfa4.r2.dev',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default nextConfig;