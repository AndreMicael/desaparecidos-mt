"use client";

import dynamic from 'next/dynamic';

// Lazy loading do dashboard admin
export const AdminDashboardLazy = dynamic(
  () => import('@/app/admin/dashboard/page').then(mod => ({ 
    default: mod.default 
  })),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    ),
    ssr: false, // Dashboard admin não precisa de SSR
  }
);

// Lazy loading da página de login admin
export const AdminLoginLazy = dynamic(
  () => import('@/app/admin/login/page').then(mod => ({ 
    default: mod.default 
  })),
  {
    loading: () => (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando login...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);
