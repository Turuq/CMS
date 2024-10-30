import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/api/:path*',
        locale: false,
        basePath: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cvurqtyyadqvtbvyshns.supabase.co',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
