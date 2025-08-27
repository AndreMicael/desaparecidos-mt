"use client";

import { User, Check } from 'lucide-react';
import { SearchForm } from './SearchForm';
import { SearchFilters } from '@/types/person';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  totalPessoas?: number;
  pessoasLocalizadas?: number;
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export function HeroSection({ 
  totalPessoas = 449, 
  pessoasLocalizadas = 23, 
  onSearch, 
  onClear 
}: HeroSectionProps) {
  return (
    <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] font-encode-sans overflow-hidden">
      {/* Background com espelhamento */}
      <motion.div 
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/bg-hero.jpg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center'
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left side - Title, subtitle and stats cards */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            {/* Title and subtitle */}
            <motion.div 
              className="text-white text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <motion.h1 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                UNIDADE DE PESSOAS DESAPARECIDAS
              </motion.h1>
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                Sua ajuda pode fazer a diferença
              </motion.p>
            </motion.div>

            {/* Statistics cards */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              {/* Pessoas Cadastradas */}
              <motion.div 
                className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex justify-center mb-3">
                  <motion.div 
                    className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </motion.div>
                </div>
                <motion.div 
                  className="text-xl md:text-2xl font-bold mb-1 text-white"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {totalPessoas}
                </motion.div>
                <div className="text-xs text-gray-300 text-white">PESSOAS CADASTRADAS</div>
              </motion.div>

              {/* Pessoas Localizadas */}
              <motion.div 
                className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex justify-center mb-3">
                  <motion.div 
                    className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </motion.div>
                </div>
                <motion.div 
                  className="text-xl md:text-2xl font-bold mb-1 text-white"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6, type: "spring", stiffness: 200 }}
                >
                  {pessoasLocalizadas}
                </motion.div>
                <div className="text-xs text-gray-300 text-white">PESSOAS LOCALIZADAS</div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right side - Compact search form */}
          <motion.div 
            className="lg:col-span-5 flex justify-center lg:justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="w-full max-w-sm lg:max-w-md">
              <SearchForm onSearch={onSearch} onClear={onClear} compact />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
