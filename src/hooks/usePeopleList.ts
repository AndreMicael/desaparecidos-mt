import { useState, useCallback, useEffect } from 'react';
import { useMemoizedFetch } from './useMemoizedFetch';
import { useDebounce } from './useDebounce';
import { Person, SearchFilters } from '@/types/person';
import { apiClient } from '@/lib/api-client';
import { usePagination } from './usePagination';

interface PeopleListResponse {
  persons: Person[];
  totalPages: number;
  totalCount: number;
  currentPage: number;
}

interface UsePeopleListOptions {
  initialFilters?: SearchFilters;
  pageSize?: number;
  autoSearch?: boolean;
  debounceMs?: number;
}

interface UsePeopleListReturn {
  // Data
  people: Person[];
  totalPages: number;
  totalCount: number;
  
  // Loading states
  loading: boolean;
  error: Error | null;
  
  // Filters and search
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  search: (filters: SearchFilters) => void;
  clearFilters: () => void;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Actions
  refetch: () => Promise<void>;
  isCached: boolean;
  isStale: boolean;
}

export function usePeopleList(options: UsePeopleListOptions = {}): UsePeopleListReturn {
  const {
    initialFilters = {
      nome: '',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: [],
      status: []
    },
    pageSize: initialPageSize = 12,
    autoSearch = true,
    debounceMs = 400,
  } = options;

  // Pagination
  const {
    currentPage,
    pageSize,
    setPage,
    setPageSize: setPaginationPageSize,
  } = usePagination({
    defaultPageSize: initialPageSize,
    defaultPage: 1,
  });

  // Filters state
  const [filters, setFiltersState] = useState<SearchFilters>(initialFilters);
  const debouncedFilters = useDebounce(filters, debounceMs);

  // Cache key for memoized fetch
  const cacheKey = `people-list-${currentPage}-${pageSize}-${JSON.stringify(debouncedFilters)}`;

  // Fetch function
  const fetchPeople = useCallback(async (): Promise<PeopleListResponse> => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: pageSize.toString(),
      ...Object.entries(debouncedFilters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            acc[key] = value.join(',');
          } else {
            acc[key] = value.toString();
          }
        }
        return acc;
      }, {} as Record<string, string>),
    });

    const response = await apiClient.get<PeopleListResponse>(`/pessoas?${params}`);
    return response;
  }, [currentPage, pageSize, debouncedFilters]);

  // Memoized fetch with cache
  const {
    data,
    loading,
    error,
    refetch,
    isCached,
    isStale,
  } = useMemoizedFetch<PeopleListResponse>(cacheKey, fetchPeople, {
    cacheTime: 5 * 60 * 1000, // 5 minutos
    staleTime: 1 * 60 * 1000, // 1 minuto
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  // Auto search when filters change
  useEffect(() => {
    if (autoSearch) {
      setPage(1); // Reset to first page when filters change
    }
  }, [debouncedFilters, autoSearch, setPage]);

  // Set filters with validation
  const setFilters = useCallback((newFilters: SearchFilters) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Search function
  const search = useCallback((searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setPage(1);
  }, [setFilters, setPage]);

  // Clear filters
  const clearFilters = useCallback(() => {
    const emptyFilters: SearchFilters = {
      nome: '',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: [],
      status: [],
    };
    setFilters(emptyFilters);
    setPage(1);
  }, [setFilters, setPage]);

  // Set page size
  const setPageSize = useCallback((size: number) => {
    setPaginationPageSize(size);
    setPage(1);
  }, [setPaginationPageSize, setPage]);

  return {
    // Data
    people: data?.persons || [],
    totalPages: data?.totalPages || 1,
    totalCount: data?.totalCount || 0,
    
    // Loading states
    loading,
    error,
    
    // Filters and search
    filters,
    setFilters,
    search,
    clearFilters,
    
    // Pagination
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    
    // Actions
    refetch,
    isCached,
    isStale,
  };
}
