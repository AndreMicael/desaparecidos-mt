import { apiClient, ApiError } from '@/lib/api-client';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('ApiClient', () => {
  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should handle successful GET request', async () => {
      const result = await apiClient.get('/pessoas/aberto/filtro');
      
      expect(result).toBeDefined();
      expect(result.content).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);
    });

    it('should handle 404 error with friendly message', async () => {
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(apiClient.get('/pessoas/aberto/filtro')).rejects.toThrow(
        'Recurso não encontrado. Verifique se a URL está correta.'
      );
    });

    it('should handle 500 error with friendly message', async () => {
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(apiClient.get('/pessoas/aberto/filtro')).rejects.toThrow(
        'Erro interno do servidor. Tente novamente mais tarde.'
      );
    });

    it('should handle timeout error', async () => {
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          return new Promise(() => {}); // Never resolves
        })
      );

      await expect(apiClient.get('/pessoas/aberto/filtro', { timeout: 100 })).rejects.toThrow(
        'Requisição cancelada ou tempo limite excedido.'
      );
    });

    it('should handle network error', async () => {
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          return HttpResponse.error();
        })
      );

      await expect(apiClient.get('/pessoas/aberto/filtro')).rejects.toThrow(
        'Erro de conexão. Verifique sua internet e tente novamente.'
      );
    });

    it('should retry on retryable errors', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          attemptCount++;
          if (attemptCount < 3) {
            return new HttpResponse(null, { status: 500 });
          }
          return HttpResponse.json({ content: [], totalPages: 1 });
        })
      );

      const result = await apiClient.get('/pessoas/aberto/filtro');
      
      expect(attemptCount).toBe(3);
      expect(result).toBeDefined();
    });

    it('should not retry on 4xx errors (except 408, 429)', async () => {
      let attemptCount = 0;
      
      server.use(
        http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
          attemptCount++;
          return new HttpResponse(null, { status: 400 });
        })
      );

      await expect(apiClient.get('/pessoas/aberto/filtro')).rejects.toThrow();
      expect(attemptCount).toBe(1);
    });
  });

  describe('POST requests', () => {
    it('should handle successful POST request', async () => {
      const testData = { nome: 'João Silva', idade: 25 };
      
      server.use(
        http.post('https://abitus-api.geia.vip/v1/pessoas', () => {
          return HttpResponse.json({ success: true, data: testData });
        })
      );

      const result = await apiClient.post('/pessoas', testData);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should handle POST with FormData', async () => {
      const formData = new FormData();
      formData.append('nome', 'João Silva');
      
      server.use(
        http.post('https://abitus-api.geia.vip/v1/pessoas', () => {
          return HttpResponse.json({ success: true });
        })
      );

      const result = await apiClient.postFormData('/pessoas', formData);
      
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Error handling', () => {
    it('should create ApiError with correct properties', () => {
      const error = new ApiError('Test error', 404, 'NOT_FOUND', { details: 'test' });
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.details).toEqual({ details: 'test' });
      expect(error.name).toBe('ApiError');
    });

    it('should map different HTTP status codes to friendly messages', async () => {
      const statusCodes = [
        { status: 400, expectedMessage: 'Dados inválidos enviados. Verifique as informações e tente novamente.' },
        { status: 401, expectedMessage: 'Não autorizado. Verifique suas credenciais.' },
        { status: 403, expectedMessage: 'Acesso negado. Você não tem permissão para esta ação.' },
        { status: 404, expectedMessage: 'Recurso não encontrado. Verifique se a URL está correta.' },
        { status: 408, expectedMessage: 'Tempo limite excedido. Tente novamente em alguns instantes.' },
        { status: 429, expectedMessage: 'Muitas requisições. Aguarde um momento antes de tentar novamente.' },
        { status: 500, expectedMessage: 'Erro interno do servidor. Tente novamente mais tarde.' },
        { status: 502, expectedMessage: 'Servidor temporariamente indisponível. Tente novamente em alguns minutos.' },
        { status: 503, expectedMessage: 'Serviço temporariamente indisponível. Tente novamente mais tarde.' },
        { status: 504, expectedMessage: 'Tempo limite do servidor. Tente novamente em alguns instantes.' },
      ];

      for (const { status, expectedMessage } of statusCodes) {
        server.use(
          http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
            return new HttpResponse(null, { status });
          })
        );

        await expect(apiClient.get('/pessoas/aberto/filtro')).rejects.toThrow(expectedMessage);
      }
    });
  });

  describe('AbortController integration', () => {
    it('should respect custom AbortSignal', async () => {
      const controller = new AbortController();
      controller.abort();

      await expect(
        apiClient.get('/pessoas/aberto/filtro', { signal: controller.signal })
      ).rejects.toThrow('Requisição cancelada ou tempo limite excedido.');
    });
  });
});
