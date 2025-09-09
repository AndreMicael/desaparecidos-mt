import { useState, useEffect, useRef, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface UseMemoizedFetchOptions {
  cacheTime?: number; // Tempo de cache em ms (padrão: 5 minutos)
  staleTime?: number; // Tempo para considerar dados stale (padrão: 1 minuto)
  refetchOnWindowFocus?: boolean; // Refetch quando a janela ganha foco
  refetchOnReconnect?: boolean; // Refetch quando reconecta
}

interface UseMemoizedFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  isStale: boolean;
  isCached: boolean;
}

// Cache global para compartilhar dados entre componentes
const globalCache = new Map<string, CacheEntry<any>>();

/**
 * Hook para fetch com cache e memoização
 * @param key - Chave única para o cache
 * @param fetchFn - Função de fetch
 * @param options - Opções de configuração
 * @returns Resultado do fetch com cache
 */
export function useMemoizedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseMemoizedFetchOptions = {}
): UseMemoizedFetchResult<T> {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutos
    staleTime = 1 * 60 * 1000, // 1 minuto
    refetchOnWindowFocus = true,
    refetchOnReconnect = true,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState<boolean>(false);
  const [isCached, setIsCached] = useState<boolean>(false);

  const fetchRef = useRef<() => Promise<T>>(fetchFn);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Atualizar a função de fetch se ela mudar
  useEffect(() => {
    fetchRef.current = fetchFn;
  }, [fetchFn]);

  // Função para verificar se os dados estão stale
  const checkStaleness = useCallback((entry: CacheEntry<T>) => {
    const now = Date.now();
    const isStale = now - entry.timestamp > staleTime;
    const isExpired = now > entry.expiresAt;
    
    setIsStale(isStale);
    
    if (isExpired) {
      globalCache.delete(key);
      return false;
    }
    
    return true;
  }, [key, staleTime]);

  // Função para buscar dados
  const fetchData = useCallback(async (force = false) => {
    // Verificar cache primeiro
    const cachedEntry = globalCache.get(key);
    
    if (cachedEntry && !force) {
      const isValid = checkStaleness(cachedEntry);
      if (isValid) {
        setData(cachedEntry.data);
        setIsCached(true);
        setLoading(false);
        setError(null);
        return;
      }
    }

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);
      setIsCached(false);

      const result = await fetchRef.current();
      
      // Verificar se a requisição foi cancelada
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      // Salvar no cache
      const now = Date.now();
      const cacheEntry: CacheEntry<T> = {
        data: result,
        timestamp: now,
        expiresAt: now + cacheTime,
      };
      
      globalCache.set(key, cacheEntry);
      
      setData(result);
      setIsStale(false);
      setLoading(false);
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }
      
      setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      setLoading(false);
    }
  }, [key, cacheTime, checkStaleness]);

  // Função para refetch
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  // Carregar dados iniciais
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch quando a janela ganha foco
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      const cachedEntry = globalCache.get(key);
      if (cachedEntry && checkStaleness(cachedEntry)) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [key, refetchOnWindowFocus, fetchData, checkStaleness]);

  // Refetch quando reconecta
  useEffect(() => {
    if (!refetchOnReconnect) return;

    const handleOnline = () => {
      const cachedEntry = globalCache.get(key);
      if (cachedEntry && checkStaleness(cachedEntry)) {
        fetchData();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [key, refetchOnReconnect, fetchData, checkStaleness]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale,
    isCached,
  };
}

/**
 * Função para limpar cache específico
 * @param key - Chave do cache a ser limpa
 */
export function clearCache(key: string): void {
  globalCache.delete(key);
}

/**
 * Função para limpar todo o cache
 */
export function clearAllCache(): void {
  globalCache.clear();
}

/**
 * Função para obter estatísticas do cache
 */
export function getCacheStats() {
  const now = Date.now();
  const entries = Array.from(globalCache.entries());
  
  return {
    totalEntries: entries.length,
    expiredEntries: entries.filter(([_, entry]) => now > entry.expiresAt).length,
    staleEntries: entries.filter(([_, entry]) => now - entry.timestamp > 60000).length, // 1 minuto
    memoryUsage: JSON.stringify(Array.from(globalCache.entries())).length,
  };
}
