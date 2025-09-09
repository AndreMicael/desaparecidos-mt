/**
 * Configuração centralizada de URLs
 * Evita URLs hardcoded no código
 */

export const URLs = {
  // APIs externas
  EXTERNAL: {
    ABITUS_API: process.env.NEXT_PUBLIC_ABITUS_API_URL || 'https://abitus-api.geia.vip/v1',
    REVERSE_GEOCODING: 'https://api.bigdatacloud.net/data/reverse-geocode-client',
  },
  
  // APIs internas
  INTERNAL: {
    BASE: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    API: {
      PESSOAS: '/api/pessoas',
      PESSOA_DETAIL: (id: string) => `/api/pessoas/${id}`,
      ESTATISTICAS: '/api/estatisticas',
      INFORMATIONS: '/api/informations',
      UPLOAD: '/api/upload',
      ADMIN: {
        INFORMATIONS: '/api/admin/informations',
        INFORMATIONS_BY_PERSON: (personId: string) => `/api/admin/informations/pessoa/${personId}`,
      },
    },
  },
  
  // Rotas da aplicação
  ROUTES: {
    HOME: '/',
    DESAPARECIDOS: '/desaparecidos',
    DESAPARECIDOS_PAGE: (page: number) => `/desaparecidos/${page}`,
    PESSOA_DETAIL: (id: string) => `/desaparecidos/pessoa/${id}`,
    LOCALIZADOS: '/localizados',
    LOCALIZADOS_PAGE: (page: number) => `/localizados/${page}`,
    LOCALIZADO_DETAIL: (id: string) => `/localizados/pessoa/${id}`,
    CONTATO: '/contato',
    COMO_AJUDAR: '/como-ajudar',
    ADMIN: {
      LOGIN: '/admin/login',
      DASHBOARD: '/admin/dashboard',
    },
  },
  
  // URLs externas
  EXTERNAL_LINKS: {
    PJC_MT: 'https://www.pjc.mt.gov.br',
    ABITUS_DOCS: 'https://abitus-api.geia.vip/docs',
    GITHUB: 'https://github.com/pjc-mt/desaparecidos-mt',
    LINKEDIN: 'https://linkedin.com/in/andre-silva-dev',
    WEBSITE: 'https://andresilva.dev',
  },
  
  // Assets
  ASSETS: {
    IMAGES: {
      LOGO: '/logo_pjc.svg',
      FAVICON: '/favicon.ico',
      NO_PHOTO: '/sem-foto.svg',
      HERO_BG: '/bg-hero.jpg',
    },
    ICONS: {
      APPLE_TOUCH: '/apple-touch-icon.png',
      ICON_16: '/icon-16x16.png',
      ICON_32: '/icon-32x32.png',
      ICON_192: '/icon-192x192.png',
      ICON_512: '/icon-512x512.png',
    },
  },
} as const;

/**
 * Constrói URL completa para API externa
 */
export function buildExternalApiUrl(endpoint: string): string {
  return `${URLs.EXTERNAL.ABITUS_API}${endpoint}`;
}

/**
 * Constrói URL completa para API interna
 */
export function buildInternalApiUrl(endpoint: string): string {
  return `${URLs.INTERNAL.BASE}${endpoint}`;
}

/**
 * Constrói URL para reverse geocoding
 */
export function buildReverseGeocodingUrl(latitude: number, longitude: number): string {
  return `${URLs.EXTERNAL.REVERSE_GEOCODING}?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`;
}

/**
 * Constrói URL para página de pessoa
 */
export function buildPersonPageUrl(id: string, isLocalized = false): string {
  const basePath = isLocalized ? URLs.ROUTES.LOCALIZADO_DETAIL(id) : URLs.ROUTES.PESSOA_DETAIL(id);
  return `${URLs.INTERNAL.BASE}${basePath}`;
}

/**
 * Constrói URL para compartilhamento
 */
export function buildShareUrl(path: string): string {
  return `${URLs.INTERNAL.BASE}${path}`;
}

/**
 * Valida se uma URL é externa
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== URLs.INTERNAL.BASE;
  } catch {
    return false;
  }
}

/**
 * Sanitiza URL para uso seguro
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Permitir apenas HTTPS em produção
    if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
      throw new Error('Apenas URLs HTTPS são permitidas em produção');
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('URL inválida:', url, error);
    return '';
  }
}
