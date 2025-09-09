import { renderHook, act } from '@testing-library/react';
import { usePersonDetails } from '@/hooks/usePersonDetails';

// Mock do useMemoizedFetch
jest.mock('@/hooks/useMemoizedFetch', () => ({
  useMemoizedFetch: jest.fn(),
}));

const mockUseMemoizedFetch = require('@/hooks/useMemoizedFetch').useMemoizedFetch;

describe('usePersonDetails', () => {
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

    const { result } = renderHook(() => usePersonDetails('1'));

    expect(result.current.person).toBeNull();
    expect(result.current.relatedPersons).toEqual([]);
    expect(result.current.statistics).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle successful data fetch', () => {
    const mockData = {
      person: {
        id: '1',
        nome: 'João Silva',
        sexo: 'M',
        status: 'DESAPARECIDO',
        foto: 'https://example.com/photo.jpg',
      },
      relatedPersons: [
        { id: '2', nome: 'Maria Silva', sexo: 'F', status: 'DESAPARECIDO' },
      ],
      statistics: {
        totalViews: 150,
        lastUpdated: '2024-01-15T10:30:00Z',
      },
    };

    mockUseMemoizedFetch.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: true,
      isStale: false,
    });

    const { result } = renderHook(() => usePersonDetails('1'));

    expect(result.current.person).toEqual(mockData.person);
    expect(result.current.relatedPersons).toEqual(mockData.relatedPersons);
    expect(result.current.statistics).toEqual(mockData.statistics);
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

    const { result } = renderHook(() => usePersonDetails('1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.person).toBeNull();
  });

  it('should handle error state', () => {
    const mockError = new Error('Person not found');

    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: mockError,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePersonDetails('1'));

    expect(result.current.error).toBe(mockError);
    expect(result.current.person).toBeNull();
  });

  it('should call useMemoizedFetch with correct parameters', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    renderHook(() => usePersonDetails('123'));

    expect(mockUseMemoizedFetch).toHaveBeenCalledWith(
      'person-details-123',
      expect.any(Function),
      {
        cacheTime: 10 * 60 * 1000, // 10 minutos
        staleTime: 2 * 60 * 1000, // 2 minutos
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      }
    );
  });

  it('should handle disabled state', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    renderHook(() => usePersonDetails('1', { enabled: false }));

    expect(mockUseMemoizedFetch).toHaveBeenCalledWith(
      'person-details-1',
      expect.any(Function),
      {
        cacheTime: 10 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
      }
    );
  });

  it('should handle custom options', () => {
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
      isCached: false,
      isStale: false,
    });

    renderHook(() => usePersonDetails('1', {
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }));

    expect(mockUseMemoizedFetch).toHaveBeenCalledWith(
      'person-details-1',
      expect.any(Function),
      {
        cacheTime: 10 * 60 * 1000,
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      }
    );
  });

  it('should handle refetch action', async () => {
    const mockRefetch = jest.fn().mockResolvedValue({});
    
    mockUseMemoizedFetch.mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: mockRefetch,
      isCached: false,
      isStale: false,
    });

    const { result } = renderHook(() => usePersonDetails('1'));

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockRefetch).toHaveBeenCalled();
  });
});
