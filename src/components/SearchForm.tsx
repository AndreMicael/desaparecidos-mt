"use client";

import { useState, useCallback } from 'react';
import { Search, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { SearchFilters } from '@/types/person';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  compact?: boolean;
}

export function SearchForm({ onSearch, onClear, compact = false }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    nome: '',
    idadeMinima: '',
    idadeMaxima: '',
    sexos: [],
    status: []
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submetendo formulário com filtros:', filters);
    onSearch(filters);
  }, [filters, onSearch]);

  const handleClear = () => {
    const emptyFilters: SearchFilters = {
      nome: '',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: [],
      status: []
    };
    setFilters(emptyFilters);
    onClear();
  };

  const toggleSexo = (sexo: 'masculino' | 'feminino') => {
    setFilters(prev => ({
      ...prev,
      sexos: prev.sexos.includes(sexo)
        ? prev.sexos.filter(s => s !== sexo)
        : [...prev.sexos, sexo]
    }));
  };

  const toggleStatus = (status: 'desaparecido' | 'localizado') => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  if (compact) {
    return (
             <div className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl w-full max-w-sm font-encode-sans border border-white/20">
         {/* Header */}
         <div className="bg-yellow-400 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <h3 className="text-white font-bold text-xs sm:text-sm">BUSCAR PESSOA DESAPARECIDA</h3>
        </div>

        {/* Form */}
        <div className="p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Nome */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2 text-white">
                <User className="w-3 h-3" />
                <label htmlFor="search-nome" className="text-xs sm:text-sm text-white">Nome</label>
              </div>
              <Input
                id="search-nome"
                value={filters.nome}
                onChange={(e) => setFilters(prev => ({ ...prev, nome: e.target.value }))}
                className="bg-black/30 border-white/30 text-white placeholder-gray-300 text-xs sm:text-sm h-8 sm:h-9 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                placeholder="Digite o nome da pessoa"
                aria-describedby="search-nome-help"
              />
              <p id="search-nome-help" className="sr-only">Digite o nome completo ou parcial da pessoa que você está procurando</p>
            </div>

            {/* Faixa Etária */}
            <fieldset className="space-y-1 sm:space-y-2">
              <legend className="text-xs sm:text-sm text-white">Faixa Etária:</legend>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="search-idade-min" className="sr-only">Idade mínima</label>
                  <Input
                    id="search-idade-min"
                    type="number"
                    value={filters.idadeMinima}
                    onChange={(e) => setFilters(prev => ({ ...prev, idadeMinima: e.target.value }))}
                    className="bg-black/30 border-white/30 text-white placeholder-gray-300 text-xs sm:text-sm h-8 sm:h-9 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    placeholder="Idade mínima"
                    min="0"
                    max="120"
                    aria-describedby="search-idade-help"
                  />
                </div>
                <div>
                  <label htmlFor="search-idade-max" className="sr-only">Idade máxima</label>
                  <Input
                    id="search-idade-max"
                    type="number"
                    value={filters.idadeMaxima}
                    onChange={(e) => setFilters(prev => ({ ...prev, idadeMaxima: e.target.value }))}
                    className="bg-black/30 border-white/30 text-white placeholder-gray-300 text-xs sm:text-sm h-8 sm:h-9 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                    placeholder="Idade máxima"
                    min="0"
                    max="120"
                    aria-describedby="search-idade-help"
                  />
                </div>
              </div>
              <p id="search-idade-help" className="sr-only">Digite a faixa etária desejada (0 a 120 anos)</p>
            </fieldset>

            {/* Sexo e Status side by side */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Sexo */}
              <fieldset className="space-y-1 sm:space-y-2">
                <legend className="text-xs sm:text-sm text-white">Sexo:</legend>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="masculino-compact"
                      checked={filters.sexos.includes('masculino')}
                      onCheckedChange={() => toggleSexo('masculino')}
                      className="border-white/40 data-[state=checked]:text-black data-[state=checked]:bg-white data-[state=checked]:border-yellow-400 w-3 h-3 sm:w-4 sm:h-4 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                      aria-describedby="search-sexo-help"
                    />
                    <label htmlFor="masculino-compact" className="text-white cursor-pointer text-xs">
                      Masculino
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="feminino-compact"
                      checked={filters.sexos.includes('feminino')}
                      onCheckedChange={() => toggleSexo('feminino')}
                      className="border-white/40  data-[state=checked]:text-black data-[state=checked]:bg-white data-[state=checked]:border-yellow-400 w-3 h-3 sm:w-4 sm:h-4 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                      aria-describedby="search-sexo-help"
                    />
                    <label htmlFor="feminino-compact" className="text-white cursor-pointer text-xs">
                      Feminino
                    </label>
                  </div>
                </div>
                <p id="search-sexo-help" className="sr-only">Selecione o sexo da pessoa que você está procurando</p>
              </fieldset>

              {/* Status */}
              <fieldset className="space-y-1 sm:space-y-2">
                <legend className="text-xs sm:text-sm text-white">Status:</legend>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="desaparecido-compact"
                      checked={filters.status.includes('desaparecido')}
                      onCheckedChange={() => toggleStatus('desaparecido')}
                      className="border-white/40  data-[state=checked]:text-black data-[state=checked]:bg-white data-[state=checked]:border-yellow-400 w-3 h-3 sm:w-4 sm:h-4 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                      aria-describedby="search-status-help"
                    />
                    <label htmlFor="desaparecido-compact" className="text-white cursor-pointer text-xs">
                      Desaparecido
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="localizado-compact"
                      checked={filters.status.includes('localizado')}
                      onCheckedChange={() => toggleStatus('localizado')}
                      className="border-white/40  data-[state=checked]:text-black data-[state=checked]:bg-white data-[state=checked]:border-yellow-400 w-3 h-3 sm:w-4 sm:h-4 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
                      aria-describedby="search-status-help"
                    />
                    <label htmlFor="localizado-compact" className="text-white cursor-pointer text-xs">
                      Localizado
                    </label>
                  </div>
                </div>
                <p id="search-status-help" className="sr-only">Selecione o status da pessoa que você está procurando</p>
              </fieldset>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-xs sm:text-sm h-8 sm:h-9 w-full focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black/50 focus:outline-none"
                aria-label="Buscar pessoas com os filtros selecionados"
              >
                <Search className="w-3 h-3 mr-2" />
                BUSCAR
              </Button>
              
              <button
                type="button"
                onClick={handleClear}
                className="text-white hover:text-yellow-400 text-xs underline text-right focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 focus:outline-none rounded px-1 py-0.5"
                aria-label="Limpar todos os filtros de busca"
              >
                LIMPAR BUSCA
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-2xl font-encode-sans">
      {/* Header */}
      <div className="bg-yellow-400 p-4 flex items-center gap-3">
        <Search className="w-6 h-6 text-white" />
        <h2 className="text-white font-bold text-lg">BUSCAR PESSOA DESAPARECIDA</h2>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <User className="w-4 h-4" />
              <label>Nome</label>
            </div>
            <Input
              value={filters.nome}
              onChange={(e) => setFilters(prev => ({ ...prev, nome: e.target.value }))}
              className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-yellow-400"
              placeholder="Digite o nome da pessoa"
            />
          </div>

          {/* Faixa Etária */}
          <div className="space-y-2">
            <label className="text-white">Faixa Etária:</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                value={filters.idadeMinima}
                onChange={(e) => setFilters(prev => ({ ...prev, idadeMinima: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-yellow-400"
                placeholder="Idade mínima"
              />
              <Input
                type="number"
                value={filters.idadeMaxima}
                onChange={(e) => setFilters(prev => ({ ...prev, idadeMaxima: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder-white/60 focus:bg-white/15 focus:border-yellow-400"
                placeholder="Idade máxima"
              />
            </div>
          </div>

          {/* Sexo e Status */}
          <div className="grid grid-cols-2 gap-8">
            {/* Sexo */}
            <div className="space-y-3">
              <label className="text-white">Sexo:</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="masculino"
                    checked={filters.sexos.includes('masculino')}
                    onCheckedChange={() => toggleSexo('masculino')}
                    className="border-white/40 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                  />
                  <label htmlFor="masculino" className="text-white cursor-pointer">
                    Masculino
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="feminino"
                    checked={filters.sexos.includes('feminino')}
                    onCheckedChange={() => toggleSexo('feminino')}
                    className="border-white/40 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                  />
                  <label htmlFor="feminino" className="text-white cursor-pointer">
                    Feminino
                  </label>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <label className="text-white">Status:</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="desaparecido"
                    checked={filters.status.includes('desaparecido')}
                    onCheckedChange={() => toggleStatus('desaparecido')}
                    className="border-white/40 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                  />
                  <label htmlFor="desaparecido" className="text-white cursor-pointer">
                    Desaparecido
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="localizado"
                    checked={filters.status.includes('localizado')}
                    onCheckedChange={() => toggleStatus('localizado')}
                    className="border-white/40 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                  />
                  <label htmlFor="localizado" className="text-white cursor-pointer">
                    Localizado
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Button
              type="button"
              onClick={handleClear}
              variant="ghost"
              className="text-white hover:text-yellow-400 hover:bg-white/10"
            >
              LIMPAR BUSCA
            </Button>
            
            <Button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-2"
            >
              <Search className="w-4 h-4 mr-2" />
              BUSCAR
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
