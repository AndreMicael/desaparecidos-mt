"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface UsePaginationOptions {
  defaultPageSize?: number;
  defaultPage?: number;
  preserveFilters?: boolean;
}

interface UsePaginationReturn {
  currentPage: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  updateUrl: (params: Record<string, string | number>) => void;
  getUrlParams: () => URLSearchParams;
}

export function usePagination({
  defaultPageSize = 12,
  defaultPage = 1,
  preserveFilters = true
}: UsePaginationOptions = {}): UsePaginationReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = useMemo(() => {
    const page = searchParams.get('page');
    return page ? Math.max(1, parseInt(page, 10)) : defaultPage;
  }, [searchParams, defaultPage]);

  const pageSize = useMemo(() => {
    const size = searchParams.get('pageSize');
    return size ? Math.max(10, parseInt(size, 10)) : defaultPageSize;
  }, [searchParams, defaultPageSize]);

  const setPage = useCallback((page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', page.toString());
    
    // Reset para página 1 se mudar o pageSize
    if (page === 1) {
      newParams.delete('page');
    }
    
    router.push(`?${newParams.toString()}`);
  }, [router, searchParams]);

  const setPageSize = useCallback((newPageSize: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('pageSize', newPageSize.toString());
    newParams.delete('page'); // Reset para página 1 ao mudar pageSize
    
    router.push(`?${newParams.toString()}`);
  }, [router, searchParams]);

  const updateUrl = useCallback((params: Record<string, string | number>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, value.toString());
      }
    });
    
    router.push(`?${newParams.toString()}`);
  }, [router, searchParams]);

  const getUrlParams = useCallback(() => {
    return new URLSearchParams(searchParams.toString());
  }, [searchParams]);

  return {
    currentPage,
    pageSize,
    setPage,
    setPageSize,
    updateUrl,
    getUrlParams
  };
}
