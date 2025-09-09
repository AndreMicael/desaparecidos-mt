"use client";

import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  showClearButton?: boolean;
  initialValue?: string;
}

export function SearchInput({
  onSearch,
  onClear,
  placeholder = "Buscar...",
  debounceMs = 300,
  className = "",
  showClearButton = true,
  initialValue = "",
}: SearchInputProps) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, debounceMs);

  // Executar busca quando o query debounced mudar
  useEffect(() => {
    if (debouncedQuery !== initialValue) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch, initialValue]);

  const handleClear = useCallback(() => {
    setQuery("");
    onClear?.();
  }, [onClear]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-10"
          aria-label="Campo de busca"
        />
        {showClearButton && query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            aria-label="Limpar busca"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      {/* Indicador de busca em andamento */}
      {query !== debouncedQuery && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}
