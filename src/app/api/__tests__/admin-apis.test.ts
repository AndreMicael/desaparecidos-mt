import { NextRequest } from 'next/server';
import { GET as getAdminInformations } from '../admin/informations/route';
import { GET as getAdminInformationsPessoa } from '../admin/informations/pessoa/[id]/route';

// Mock do fetch global
global.fetch = jest.fn();

// Mock do NextRequest
const createMockRequest = (url: string, searchParams?: Record<string, string>): NextRequest => {
  const urlObj = new URL(url);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }
  return {
    url: urlObj.toString(),
    nextUrl: urlObj,
  } as NextRequest;
};

describe('APIs Administrativas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/informations', () => {
    it('deve buscar todas as informações administrativas', async () => {
      const mockPessoasResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            ultimaOcorrencia: { ocoId: 123 }
          },
          {
            id: 2,
            nome: 'Maria Santos',
            ultimaOcorrencia: { ocoId: 456 }
          }
        ],
        totalElements: 2
      };

      const mockInformationsResponse = [
        {
          id: 1,
          informacoes: 'Informação administrativa'
        }
      ];

      // Mock da busca de pessoas
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      // Mock da busca de informações para cada ocoId
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockInformationsResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{ ...mockInformationsResponse[0], id: 2 }])
        });

      const request = createMockRequest('http://localhost:3000/api/admin/informations');
      const response = await getAdminInformations(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(global.fetch).toHaveBeenCalledTimes(3); // 1 para pessoas + 2 para informações
    });

    it('deve tratar erro na busca de pessoas', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const request = createMockRequest('http://localhost:3000/api/admin/informations');
      const response = await getAdminInformations(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erro interno do servidor');
    });

    it('deve tratar erro na busca de informações específicas', async () => {
      const mockPessoasResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            ultimaOcorrencia: { ocoId: 123 }
          }
        ],
        totalElements: 1
      };

      // Mock da busca de pessoas (sucesso)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      // Mock da busca de informações (erro)
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found')
      });

      const request = createMockRequest('http://localhost:3000/api/admin/informations');
      const response = await getAdminInformations(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(0); // Nenhuma informação válida encontrada
    });
  });

  describe('GET /api/admin/informations/pessoa/[id]', () => {
    it('deve buscar informações de uma pessoa específica', async () => {
      const mockPessoasResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            ultimaOcorrencia: { ocoId: 123 }
          }
        ],
        totalElements: 1
      };

      const mockInformationsResponse = [
        {
          id: 1,
          informacoes: 'Informações da pessoa'
        }
      ];

      // Mock da busca das pessoas
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      // Mock da busca das informações
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockInformationsResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/admin/informations/pessoa/1');
      const response = await getAdminInformationsPessoa(request, {
        params: Promise.resolve({ id: '1' })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0]).toHaveProperty('ocoId', 123);
    });

    it('deve tratar pessoa não encontrada', async () => {
      const mockPessoasResponse = {
        content: [],
        totalElements: 0
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/admin/informations/pessoa/999');
      const response = await getAdminInformationsPessoa(request, {
        params: Promise.resolve({ id: '999' })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Pessoa não encontrada');
    });

    it('deve tratar erro interno do servidor', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const request = createMockRequest('http://localhost:3000/api/admin/informations/pessoa/1');
      const response = await getAdminInformationsPessoa(request, {
        params: Promise.resolve({ id: '1' })
      });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Erro interno do servidor');
    });
  });


  describe('Testes de Segurança', () => {
    it('deve validar IDs numéricos', async () => {
      const mockPessoasResponse = {
        content: [],
        totalElements: 0
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/admin/informations/pessoa/abc');
      const response = await getAdminInformationsPessoa(request, {
        params: Promise.resolve({ id: 'abc' })
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Pessoa não encontrada');
    });

    it('deve tratar IDs muito grandes', async () => {
      const request = createMockRequest('http://localhost:3000/api/admin/informations/pessoa/999999999');
      const response = await getAdminInformationsPessoa(request, {
        params: Promise.resolve({ id: '999999999' })
      });
      const data = await response.json();

      // Deve tentar buscar mesmo com ID grande
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Testes de Performance', () => {
    it('deve processar múltiplas informações eficientemente', async () => {
      const mockPessoasResponse = {
        content: Array.from({ length: 100 }, (_, i) => ({
          id: i + 1,
          nome: `Pessoa ${i + 1}`,
          ultimaOcorrencia: { ocoId: i + 1000 }
        })),
        totalElements: 100
      };

      // Mock da busca de pessoas
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      // Mock de todas as buscas de informações (retorna array)
      for (let i = 0; i < 100; i++) {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([{
            id: i + 1,
            informacoes: `Informação ${i + 1}`
          }])
        });
      }

      const request = createMockRequest('http://localhost:3000/api/admin/informations');
      const startTime = Date.now();
      
      const response = await getAdminInformations(request);
      const data = await response.json();
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(100);
      expect(duration).toBeLessThan(5000); // Deve completar em menos de 5 segundos
    });
  });
});
