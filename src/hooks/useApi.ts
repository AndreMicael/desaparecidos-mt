"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient, ApiError } from '@/lib/api-client';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  retry: () => void;
}

export interface UseApiOptions {
  immediate?: boolean;
  timeout?: number;
  retries?: number;
}

/**
 * Hook para requisições GET com cache e gerenciamento de estado
 */
export function useApi<T>(
  endpoint: string | null,
  options: UseApiOptions = {}
): ApiState<T> {
  const { immediate = true, timeout, retries } = options;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<ApiError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) return;

    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(endpoint, {
        timeout,
        signal: abortControllerRef.current.signal,
        retries,
      });
      
      setData(result);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    } finally {
      setLoading(false);
    }
  }, [endpoint, timeout, retries]);

  const retry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (immediate && endpoint) {
      fetchData();
    }

    // Cleanup: cancelar requisição ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, immediate, endpoint]);

  return { data, loading, error, retry };
}

/**
 * Hook para requisições POST
 */
export function useApiPost<T, R = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const post = useCallback(async (
    endpoint: string,
    data?: T,
    options: { timeout?: number; retries?: number } = {}
  ): Promise<R | null> => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.post<R>(endpoint, data, {
        timeout: options.timeout,
        signal: abortControllerRef.current.signal,
        retries: options.retries,
      });
      
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const postFormData = useCallback(async (
    endpoint: string,
    formData: FormData,
    options: { timeout?: number; retries?: number } = {}
  ): Promise<R | null> => {
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Criar novo AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiClient.postFormData<R>(endpoint, formData, {
        timeout: options.timeout,
        signal: abortControllerRef.current.signal,
        retries: options.retries,
      });
      
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return { post, postFormData, loading, error, cancel };
}

/**
 * Hook para cache simples com SWR-like behavior
 */
export function useApiCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    revalidateOnFocus?: boolean;
    revalidateOnReconnect?: boolean;
    dedupingInterval?: number;
  } = {}
) {
  const { revalidateOnFocus = true, revalidateOnReconnect = true, dedupingInterval = 2000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const lastFetchRef = useRef<number>(0);
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());

  const fetchData = useCallback(async (force = false) => {
    const now = Date.now();
    const cached = cacheRef.current.get(key);
    
    // Verificar cache se não for forçado
    if (!force && cached && (now - cached.timestamp) < dedupingInterval) {
      setData(cached.data);
      return cached.data;
    }

    // Verificar se já está carregando (deduplicação)
    if (loading && (now - lastFetchRef.current) < dedupingInterval) {
      return data;
    }

    lastFetchRef.current = now;
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      
      // Atualizar cache
      cacheRef.current.set(key, { data: result, timestamp: now });
      setData(result);
      
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, loading, data, dedupingInterval]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    cacheRef.current.set(key, { data: newData, timestamp: Date.now() });
  }, [key]);

  const revalidate = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Revalidar ao focar na janela
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [fetchData, revalidateOnFocus]);

  // Revalidar ao reconectar
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      fetchData();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [fetchData, revalidateOnReconnect]);

  return {
    data,
    loading,
    error,
    mutate,
    revalidate,
    fetchData: () => fetchData(true),
  };
}
