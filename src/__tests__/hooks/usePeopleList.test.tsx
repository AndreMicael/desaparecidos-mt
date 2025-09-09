import { renderHook, act, waitFor } from '@testing-library/react';
import { usePeopleList } from '@/hooks/usePeopleList';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Mock do usePagination
jest.mock('@/hooks/usePagination', () => ({
  usePagination: () => ({
    currentPage: 1,
    pageSize: 12,
    setPage: jest.fn(),
    setPageSize: jest.fn(),
  }),
}));

// Mock do useMemoizedFetch
jest.mock('@/hooks/useMemoizedFetch', () => ({
  useMemoizedFetch: jest.fn(),
}));

const mockUseMemoizedFetch = require('@/hooks/useMemoizedFetch').useMemoizedFetch;

describe('usePeopleList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state correctly', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    expect(result.current.people).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalCount).toBe(0);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({
      nome: '',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: [],
      status: [],
    });
  });

  it('should handle successful data fetch', () => {
    const mockData = {
      persons: [
        { id: '1', nome: 'João Silva', sexo: 'M', status: 'DESAPARECIDO' },
        { id: '2', nome: 'Maria Santos', sexo: 'F', status: 'LOCALIZADO' },
      ],
      totalPages: 2,
      totalCount: 2,
      currentPage: 1,
    };

    mockUseMemoizedFetch.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: true,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    expect(result.current.people).toEqual(mockData.persons);
    expect(result.current.totalPages).toBe(2);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.isCached).toBe(true);
  });

  it('should handle loading state', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    expect(result.current.loading).toBe(true);
    expect(result.current.people).toEqual([]);
  });

  it('should handle error state', () => {
    const mockError = new Error('API Error');

    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    expect(result.current.error).toBe(mockError);
    expect(result.current.people).toEqual([]);
  });

  it('should update filters correctly', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    act(() => {
      result.current.setFilters({
        nome: 'João',
        sexos: ['masculino'],
        status: ['desaparecido'],
      });
    });

    expect(result.current.filters).toEqual({
      nome: 'João',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: ['masculino'],
      status: ['desaparecido'],
    });
  });

  it('should clear filters correctly', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList({
      initialFilters: {
        nome: 'João',
        sexos: ['masculino'],
        status: ['desaparecido'],
      },
    }));

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      nome: '',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: [],
      status: [],
    });
  });

  it('should call search with correct parameters', () => {
    const mockRefetch = jest.fn();
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: mockRefetch,
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    act(() => {
      result.current.search({
        nome: 'Maria',
        sexos: ['feminino'],
      });
    });

    expect(result.current.filters).toEqual({
      nome: 'Maria',
      idadeMinima: '',
      idadeMaxima: '',
      sexos: ['feminino'],
      status: [],
    });
  });

  it('should handle page size change', () => {
    const mockSetPageSize = jest.fn();
    const mockSetPage = jest.fn();

    // Mock usePagination with custom implementation
    jest.doMock('@/hooks/usePagination', () => ({
      usePagination: () => ({
        currentPage: 1,
        pageSize: 12,
        setPage: mockSetPage,
        setPageSize: mockSetPageSize,
      }),
    }));

    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePeopleList());

    act(() => {
      result.current.setPageSize(24);
    });

    expect(mockSetPageSize).toHaveBeenCalledWith(24);
    expect(mockSetPage).toHaveBeenCalledWith(1);
  });
});
