"use client";

import { User, Check } from 'lucide-react';
import { SearchForm } from './SearchForm';
import { SearchFilters } from '@/types/person';

interface HeroSectionProps {
  totalPessoas?: number;
  pessoasLocalizadas?: number;
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export function HeroSection({ 
  totalPessoas = 449, 
  pessoasLocalizadas = 127, 
  onSearch, 
  onClear 
}: HeroSectionProps) {
  return (
    <div className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] font-encode-sans overflow-hidden">
      {/* Background com espelhamento */}
      <div 
        className="absolute inset-0"
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
            <div className="text-white text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white leading-tight">
                UNIDADE DE PESSOAS DESAPARECIDAS
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-200">
                Sua ajuda pode fazer a diferença
              </p>
            </div>

            {/* Statistics cards */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
              {/* Pessoas Cadastradas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1 text-white">{totalPessoas}</div>
                <div className="text-xs text-gray-300 text-white">PESSOAS CADASTRADAS</div>
              </div>

              {/* Pessoas Localizadas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-4 md:p-6 text-center text-white flex-1 sm:flex-none sm:min-w-[160px] md:min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>
                <div className="text-xl md:text-2xl font-bold mb-1 text-white">{pessoasLocalizadas}</div>
                <div className="text-xs text-gray-300 text-white">PESSOAS LOCALIZADAS</div>
              </div>
            </div>
          </div>

          {/* Right side - Compact search form */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm lg:max-w-md">
              <SearchForm onSearch={onSearch} onClear={onClear} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
