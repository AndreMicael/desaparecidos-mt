import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remover output: 'standalone' para compatibilidade com Vercel
  // output: 'standalone', // Usado apenas para Docker
  // Configuração para resolver warning de múltiplos lockfiles
  outputFileTracingRoot: process.cwd(),
  
  // Headers de segurança globais
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=(), usb=()'
          }
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      }
    ];
  },
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
