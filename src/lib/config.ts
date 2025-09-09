/**
 * Configurações centralizadas da aplicação
 * Usa variáveis de ambiente com fallbacks para desenvolvimento
 */

export const config = {
  // API Externa (Abitus)
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://abitus-api.geia.vip/v1',
    timeout: 15000, // 15 segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo
  },
  
  // Aplicação
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    name: 'Desaparecidos MT',
  },
  
  // Upload
  upload: {
    maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'), // 5MB
    maxFiles: parseInt(process.env.NEXT_PUBLIC_MAX_FILES || '5'),
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  },
  
  // Cache
  cache: {
    ttl: parseInt(process.env.NEXT_PUBLIC_CACHE_TTL || '300000'), // 5 minutos
  },
  
  // Paginação
  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [10, 20, 50],
  },
  
  // Geolocalização
  geolocation: {
    timeout: 10000, // 10 segundos
    maximumAge: 300000, // 5 minutos
    enableHighAccuracy: true,
  },
} as const;

// Validação das configurações em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Configurações carregadas:', {
    apiBaseUrl: config.api.baseUrl,
    appUrl: config.app.url,
    maxFileSize: `${config.upload.maxFileSize / 1024 / 1024}MB`,
    maxFiles: config.upload.maxFiles,
  });
}
