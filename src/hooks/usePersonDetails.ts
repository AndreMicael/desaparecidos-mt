import { useState, useCallback } from 'react';
import { useMemoizedFetch } from './useMemoizedFetch';
import { Person } from '@/types/person';
import { apiClient } from '@/lib/api-client';

interface PersonDetailsResponse {
  person: Person;
  relatedPersons?: Person[];
  statistics?: {
    totalViews: number;
    lastUpdated: string;
  };
}

interface UsePersonDetailsOptions {
  enabled?: boolean;
  refetchOnFocus?: boolean;
  refetchOnReconnect?: boolean;
}

interface UsePersonDetailsReturn {
  // Data
  person: Person | null;
  relatedPersons: Person[];
  statistics: {
    totalViews: number;
    lastUpdated: string;
  } | null;
  
  // Loading states
  loading: boolean;
  error: Error | null;
  
  // Actions
  refetch: () => Promise<void>;
  isCached: boolean;
  isStale: boolean;
}

export function usePersonDetails(
  personId: string,
  options: UsePersonDetailsOptions = {}
): UsePersonDetailsReturn {
  const {
    enabled = true,
    refetchOnFocus = true,
    refetchOnReconnect = true,
  } = options;

  // Cache key for memoized fetch
  const cacheKey = `person-details-${personId}`;

  // Fetch function
  const fetchPersonDetails = useCallback(async (): Promise<PersonDetailsResponse> => {
    if (!enabled || !personId) {
      throw new Error('Person ID is required');
    }

    const response = await apiClient.get<PersonDetailsResponse>(`/pessoas/${personId}`);
    return response;
  }, [personId, enabled]);

  // Memoized fetch with cache
  const {
    data,
    loading,
    error,
    refetch,
    isCached,
    isStale,
  } = useMemoizedFetch<PersonDetailsResponse>(cacheKey, fetchPersonDetails, {
    cacheTime: 10 * 60 * 1000, // 10 minutos
    staleTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: refetchOnFocus,
    refetchOnReconnect: refetchOnReconnect,
  });

  return {
    // Data
    person: data?.person || null,
    relatedPersons: data?.relatedPersons || [],
    statistics: data?.statistics || null,
    
    // Loading states
    loading,
    error,
    
    // Actions
    refetch,
    isCached,
    isStale,
  };
}
