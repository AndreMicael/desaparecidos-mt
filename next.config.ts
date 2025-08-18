import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3dev.pjc.mt.gov.br',
        pathname: '/abitus.foto-pessoa/**',
      },
      {
        protocol: 'https',
        hostname: 's3dev.pjc.mt.gov.br',
        pathname: '/delegaciadigital.desaparecidos/**',
      },
    ],
  },
};

export default nextConfig;
