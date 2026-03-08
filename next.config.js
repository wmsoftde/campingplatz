const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { dev, isServer }) => {
    // Disable persistent caching on CI/Shared Hosting if needed
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
