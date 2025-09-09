"use client";

import dynamic from 'next/dynamic';
import { PersonDetailSkeleton } from '@/components/ui/skeletons';

// Lazy loading do InformationForm com skeleton
export const InformationFormLazy = dynamic(
  () => import('@/components/InformationForm').then(mod => ({ 
    default: mod.InformationForm 
  })),
  {
    loading: () => <PersonDetailSkeleton />,
    ssr: false, // Desabilitar SSR para formulários pesados
  }
);

// Lazy loading do PosterGenerator
export const PosterGeneratorLazy = dynamic(
  () => import('@/components/PosterGenerator').then(mod => ({ 
    default: mod.PosterGenerator 
  })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        <span className="ml-2 text-gray-600">Carregando gerador de cartazes...</span>
      </div>
    ),
    ssr: false,
  }
);
