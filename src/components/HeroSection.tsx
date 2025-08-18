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
    <div className="relative min-h-[500px] font-encode-sans overflow-hidden">
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Left side - Title, subtitle and stats cards */}
          <div className="col-span-7 space-y-8">
            {/* Title and subtitle */}
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-3 text-white leading-tight">
                UNIDADE DE PESSOAS DESAPARECIDAS
              </h1>
              <p className="text-lg text-gray-200">
                Sua ajuda pode fazer a diferença
              </p>
            </div>

            {/* Statistics cards */}
            <div className="flex gap-6">
              {/* Pessoas Cadastradas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 text-center text-white min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1 text-white">{totalPessoas}</div>
                <div className="text-xs text-gray-300 text-white">PESSOAS CADASTRADAS</div>
              </div>

              {/* Pessoas Localizadas */}
              <div className="bg-black/70 backdrop-blur-sm rounded-lg p-6 text-center text-white min-w-[180px] border border-white/20">
                <div className="flex justify-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1 text-white">{pessoasLocalizadas}</div>
                <div className="text-xs text-gray-300 text-white">PESSOAS LOCALIZADAS</div>
              </div>
            </div>
          </div>

          {/* Right side - Compact search form */}
          <div className="col-span-5">
            <SearchForm onSearch={onSearch} onClear={onClear} compact />
          </div>
        </div>
      </div>
    </div>
  );
}
