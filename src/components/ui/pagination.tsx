"use client";

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { config } from '@/lib/config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems?: number;
  className?: string;
}

const PAGE_SIZE_OPTIONS = config.pagination.pageSizeOptions;

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems,
  className = ""
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || 0);

  return (
    <motion.div 
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Informações e seletor de página */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Informações */}
        {totalItems && (
          <div className="text-sm text-gray-700">
            Mostrando {startItem} a {endItem} de {totalItems} resultados
          </div>
        )}
        
        {/* Seletor de itens por página */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700">
            Itens por página:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controles de paginação */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* Botão Anterior */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
          </motion.div>
          
          {/* Números das páginas */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNumber;
              
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              const isActive = pageNumber === currentPage;
              
              return (
                <motion.button
                  key={pageNumber}
                  onClick={() => onPageChange(pageNumber)}
                  className={`w-8 h-8 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-yellow-400 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pageNumber}
                </motion.button>
              );
            })}
            
            {/* Reticências se necessário */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-gray-500">...</span>
            )}
            
            {/* Última página se não estiver visível */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <motion.button
                onClick={() => onPageChange(totalPages)}
                className="w-8 h-8 text-sm rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {totalPages}
              </motion.button>
            )}
          </div>
          
          {/* Botão Próxima */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-transparent border-2 border-yellow-400 text-gray-700 hover:bg-[#877a4e] hover:text-white disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
            >
              Próxima
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
