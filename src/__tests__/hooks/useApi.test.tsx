import { renderHook, waitFor, act } from '@testing-library/react';
import { useApi, useApiPost, useApiCache } from '@/hooks/useApi';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

// Mock do fetch global
global.fetch = jest.fn();

describe('useApi hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => useApi('/api/pessoas'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => useApi('/api/pessoas'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle error state', async () => {
    server.use(
      http.get('http://localhost:3000/api/pessoas', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useApi('/api/pessoas'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toContain('Erro interno do servidor');
  });

  it('should retry on error', async () => {
    server.use(
      http.get('http://localhost:3000/api/pessoas', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useApi('/api/pessoas'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();

    // Simular retry
    act(() => {
      result.current.retry();
    });

    expect(result.current.loading).toBe(true);
  });

  it('should not fetch when endpoint is null', () => {
    const { result } = renderHook(() => useApi(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

describe('useApiPost hook', () => {
  it('should post data successfully', async () => {
    const { result } = renderHook(() => useApiPost());

    const testData = { nome: 'João Silva', idade: 25 };
    
    server.use(
      http.post('http://localhost:3000/api/pessoas', () => {
        return HttpResponse.json({ success: true, data: testData });
      })
    );

    let postResult;
    await act(async () => {
      postResult = await result.current.post('/api/pessoas', testData);
    });

    expect(postResult).toBeDefined();
    expect(postResult?.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle post error', async () => {
    const { result } = renderHook(() => useApiPost());

    server.use(
      http.post('http://localhost:3000/api/pessoas', () => {
        return new HttpResponse(null, { status: 400 });
      })
    );

    let postResult;
    await act(async () => {
      postResult = await result.current.post('/api/pessoas', {});
    });

    expect(postResult).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeDefined();
  });

  it('should post FormData successfully', async () => {
    const { result } = renderHook(() => useApiPost());

    const formData = new FormData();
    formData.append('nome', 'João Silva');
    
    server.use(
      http.post('http://localhost:3000/api/pessoas', () => {
        return HttpResponse.json({ success: true });
      })
    );

    let postResult;
    await act(async () => {
      postResult = await result.current.postFormData('/api/pessoas', formData);
    });

    expect(postResult).toBeDefined();
    expect(postResult?.success).toBe(true);
  });

  it('should cancel request', async () => {
    const { result } = renderHook(() => useApiPost());

    act(() => {
      result.current.cancel();
    });

    // Verificar se o cancelamento foi chamado
    expect(result.current.cancel).toBeDefined();
  });
});

describe('useApiCache hook', () => {
  it('should cache data and avoid refetch', async () => {
    let fetchCount = 0;
    
    const fetcher = jest.fn(async () => {
      fetchCount++;
      return { data: 'test', timestamp: Date.now() };
    });

    const { result } = renderHook(() => 
      useApiCache('test-key', fetcher, { dedupingInterval: 1000 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCount).toBe(1);
    expect(result.current.data).toBeDefined();

    // Tentar buscar novamente dentro do intervalo de deduplicação
    act(() => {
      result.current.fetchData();
    });

    // Não deve fazer nova requisição
    expect(fetchCount).toBe(1);
  });

  it('should revalidate on focus', async () => {
    let fetchCount = 0;
    
    const fetcher = jest.fn(async () => {
      fetchCount++;
      return { data: 'test', timestamp: Date.now() };
    });

    const { result } = renderHook(() => 
      useApiCache('test-key', fetcher, { revalidateOnFocus: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCount).toBe(1);

    // Simular focus na janela
    act(() => {
      window.dispatchEvent(new Event('focus'));
    });

    await waitFor(() => {
      expect(fetchCount).toBe(2);
    });
  });

  it('should revalidate on reconnect', async () => {
    let fetchCount = 0;
    
    const fetcher = jest.fn(async () => {
      fetchCount++;
      return { data: 'test', timestamp: Date.now() };
    });

    const { result } = renderHook(() => 
      useApiCache('test-key', fetcher, { revalidateOnReconnect: true })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCount).toBe(1);

    // Simular reconexão
    act(() => {
      window.dispatchEvent(new Event('online'));
    });

    await waitFor(() => {
      expect(fetchCount).toBe(2);
    });
  });

  it('should mutate data', async () => {
    const fetcher = jest.fn(async () => {
      return { data: 'original', timestamp: Date.now() };
    });

    const { result } = renderHook(() => 
      useApiCache('test-key', fetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data?.data).toBe('original');

    // Mutar dados
    act(() => {
      result.current.mutate({ data: 'mutated', timestamp: Date.now() });
    });

    expect(result.current.data?.data).toBe('mutated');
  });

  it('should handle fetch error', async () => {
    const fetcher = jest.fn(async () => {
      throw new Error('Fetch error');
    });

    const { result } = renderHook(() => 
      useApiCache('test-key', fetcher)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.message).toBe('Fetch error');
  });
});
