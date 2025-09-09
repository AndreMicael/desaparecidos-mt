"use client";

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className = "", animate = true }: SkeletonProps) {
  return (
    <div
      className={`bg-gray-200 rounded ${animate ? 'animate-pulse' : ''} ${className}`}
      role="status"
      aria-label="Carregando conteúdo"
    />
  );
}

// Skeleton para cards de pessoa
export function PersonCardSkeleton() {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-label="Carregando informações da pessoa"
    >
      {/* Skeleton da foto */}
      <Skeleton className="h-48 w-full" />
      
      {/* Skeleton do conteúdo */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-6 w-20" />
      </div>
    </motion.div>
  );
}

// Skeleton para lista de pessoas
export function PersonListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-label={`Carregando lista de ${count} pessoas`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <PersonCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton para detalhes de pessoa
export function PersonDetailSkeleton() {
  return (
    <div 
      className="max-w-4xl mx-auto"
      role="status"
      aria-label="Carregando detalhes da pessoa"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Skeleton da foto principal */}
        <Skeleton className="h-64 w-full" />
        
        <div className="p-6 space-y-6">
          {/* Skeleton do título */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          
          {/* Skeleton das informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
          
          {/* Skeleton das ações */}
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-24" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton para formulário
export function FormSkeleton() {
  return (
    <div 
      className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6"
      role="status"
      aria-label="Carregando formulário"
    >
      <div className="space-y-6">
        {/* Skeleton do título */}
        <Skeleton className="h-8 w-1/3" />
        
        {/* Skeleton dos campos */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        
        {/* Skeleton dos botões */}
        <div className="flex gap-4 justify-end">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}

// Skeleton para tabela
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden"
      role="status"
      aria-label={`Carregando tabela com ${rows} linhas e ${columns} colunas`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton para estatísticas
export function StatsSkeleton() {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      role="status"
      aria-label="Carregando estatísticas"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}
