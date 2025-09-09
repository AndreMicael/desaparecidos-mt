"use client";

import { motion } from 'framer-motion';
import { RefreshCw, AlertCircle, Search, Users, Wifi, WifiOff } from 'lucide-react';
import { Button } from './button';

interface LoadingStateProps {
  message?: string;
  showSpinner?: boolean;
}

export function LoadingState({ 
  message = "Carregando...", 
  showSpinner = true 
}: LoadingStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showSpinner && (
        <motion.div
          className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      <p className="text-gray-600 text-center">{message}</p>
    </motion.div>
  );
}

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  title = "Nenhum resultado encontrado", 
  message = "Não há dados para exibir no momento.",
  icon,
  action
}: EmptyStateProps) {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {icon || <Search className="w-8 h-8 text-gray-400" />}
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {action && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={action.onClick}
            className="bg-yellow-400 text-white hover:bg-yellow-500"
          >
            {action.label}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  error?: any;
}

export function ErrorState({ 
  title = "Ops! Algo deu errado", 
  message = "Não foi possível carregar os dados. Tente novamente.",
  onRetry,
  showRetry = true,
  error
}: ErrorStateProps) {
  const isNetworkError = error?.code === 'NETWORK_ERROR' || error?.code === 'TIMEOUT';
  const isOffline = !navigator.onLine;

  return (
    <motion.div 
      className="flex flex-col items-center justify-center py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        {isOffline ? (
          <WifiOff className="w-8 h-8 text-red-500" />
        ) : isNetworkError ? (
          <Wifi className="w-8 h-8 text-red-500" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-500" />
        )}
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isOffline ? "Sem conexão com a internet" : title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {isOffline 
          ? "Verifique sua conexão com a internet e tente novamente."
          : error?.message || message
        }
      </p>
      
      {showRetry && onRetry && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
          >
            <RefreshCw className="w-4 h-4" />
            {isOffline ? "Tentar Novamente" : "Tentar Novamente"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

// Estados específicos para pessoas
export function PeopleLoadingState() {
  return <LoadingState message="Carregando pessoas..." />;
}

export function PeopleEmptyState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      title="Nenhuma pessoa encontrada"
      message="Não há pessoas desaparecidas ou localizadas para exibir no momento."
      icon={<Users className="w-8 h-8 text-gray-400" />}
      action={onRetry ? { label: "Atualizar", onClick: onRetry } : undefined}
    />
  );
}

export function PeopleErrorState({ onRetry, error }: { onRetry?: () => void; error?: any }) {
  return (
    <ErrorState
      title="Erro ao carregar pessoas"
      message="Não foi possível carregar a lista de pessoas. Verifique sua conexão e tente novamente."
      onRetry={onRetry}
      error={error}
    />
  );
}

// Skeleton para lista de pessoas
export function PeopleListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {/* Skeleton da foto */}
          <div className="h-48 bg-gray-200 animate-pulse" />
          
          {/* Skeleton do conteúdo */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton para detalhes de pessoa
export function PersonDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Skeleton da foto principal */}
        <div className="h-64 bg-gray-200 animate-pulse" />
        
        <div className="p-6 space-y-6">
          {/* Skeleton do título */}
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
          
          {/* Skeleton das informações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              </div>
            ))}
          </div>
          
          {/* Skeleton das ações */}
          <div className="flex gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded animate-pulse w-24" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
