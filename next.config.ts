import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remover output: 'standalone' para compatibilidade com Vercel
  // output: 'standalone', // Usado apenas para Docker
  // Configuração para resolver warning de múltiplos lockfiles
  outputFileTracingRoot: process.cwd(),
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
  // Configurações específicas para produção
  experimental: {
    // Otimizações para Vercel
    optimizePackageImports: ['lucide-react', '@radix-ui/react-checkbox'],
  },
  // Configurações de webpack para resolver problemas de build
  webpack: (config, { isServer }) => {
    // Resolver problemas de módulos
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
};

export default nextConfig;
