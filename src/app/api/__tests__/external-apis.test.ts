import { NextRequest } from 'next/server';
import { GET as getPessoas } from '../pessoas/route';
import { GET as getEstatisticas } from '../estatisticas/route';
import { GET as getInformationsExternal, POST as postInformationsExternal } from '../informations/external/route';
import { GET as getInformations } from '../informations/route';

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

// Mock do FormData
const createMockFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => formData.append(key, item));
    } else {
      formData.append(key, value);
    }
  });
  return formData;
};

describe('APIs Externas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/pessoas', () => {
    it('deve retornar lista de pessoas com paginação', async () => {
      const mockResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            idade: 25,
            sexo: 'MASCULINO',
            status: 'DESAPARECIDO',
            ultimaOcorrencia: { ocoId: 123 }
          }
        ],
        totalElements: 1,
        totalPages: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/pessoas', {
        page: '1',
        pageSize: '12'
      });

      const response = await getPessoas(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.total).toBe(1);
      expect(data.page).toBe(1);
      expect(data.pageSize).toBe(12);
    });

    it('deve aplicar filtros de busca corretamente', async () => {
      const mockResponse = {
        content: [
          {
            id: 1,
            nome: 'Maria Santos',
            idade: 30,
            sexo: 'FEMININO',
            status: 'DESAPARECIDO',
            ultimaOcorrencia: { ocoId: 123 }
          }
        ],
        totalElements: 1,
        totalPages: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/pessoas', {
        nome: 'Maria',
        sexos: 'FEMININO',
        idadeMinima: '25',
        idadeMaxima: '35'
      });

      const response = await getPessoas(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('nome=Maria'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sexo=FEMININO'),
        expect.any(Object)
      );
    });

    it('deve tratar erro da API externa', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const request = createMockRequest('http://localhost:3000/api/pessoas');
      const response = await getPessoas(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erro interno do servidor');
    });
  });

  describe('GET /api/estatisticas', () => {
    it('deve retornar estatísticas corretas', async () => {
      const mockTotalResponse = {
        totalElements: 100,
        content: []
      };

      const mockLocalizadasResponse = {
        totalElements: 25,
        content: []
      };

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockTotalResponse)
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockLocalizadasResponse)
        });

      const response = await getEstatisticas();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.total).toBe(100);
      expect(data.localizadas).toBe(25);
    });

    it('deve tratar erro na busca de estatísticas', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const response = await getEstatisticas();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erro interno do servidor');
    });
  });

  describe('POST /api/informations/external', () => {
    it('deve enviar informações com sucesso', async () => {
      const mockFormData = createMockFormData({
        personId: '123',
        informantName: 'João Silva',
        informantPhone: '123456789',
        informantEmail: 'joao@email.com',
        sightingDate: '15/01/2024',
        sightingLocation: 'Centro da cidade',
        description: 'Vi a pessoa na praça central',
        photos: []
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      // Mock da busca da pessoa
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            id: 123,
            ultimaOcorrencia: { ocoId: 456 }
          }]
        })
      });

      // Mock do envio da informação
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const response = await postInformationsExternal(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it('deve validar campos obrigatórios', async () => {
      const mockFormData = createMockFormData({
        personId: '',
        sightingLocation: '',
        description: ''
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      const response = await postInformationsExternal(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Campos obrigatórios não preenchidos');
    });

    it('deve validar personId numérico', async () => {
      const mockFormData = createMockFormData({
        personId: 'abc',
        sightingLocation: 'Centro',
        description: 'Descrição válida'
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      const response = await postInformationsExternal(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('ID da pessoa deve ser um número válido');
    });

    it('deve tratar erro 404 da API externa', async () => {
      const mockFormData = createMockFormData({
        personId: '999',
        sightingLocation: 'Centro',
        description: 'Descrição válida'
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      // Mock da busca da pessoa
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            id: 999,
            ultimaOcorrencia: { ocoId: 999 }
          }]
        })
      });

      // Mock do erro 404
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found')
      });

      const response = await postInformationsExternal(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe('Ocorrência não encontrada. Verifique se o ID da pessoa está correto.');
    });
  });

  describe('GET /api/informations/external', () => {
    it('deve buscar informações por ocold', async () => {
      const mockResponse = {
        id: 1,
        informacoes: 'Informação de teste'
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/informations/external', {
        ocold: '123'
      });

      const response = await getInformationsExternal(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockResponse);
    });

    it('deve validar parâmetro ocold obrigatório', async () => {
      const request = createMockRequest('http://localhost:3000/api/informations/external');
      const response = await getInformationsExternal(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('ID da ocorrência (ocold) é obrigatório');
    });

    it('deve tratar erro da API externa', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      });

      const request = createMockRequest('http://localhost:3000/api/informations/external', {
        ocold: '123'
      });

      const response = await getInformationsExternal(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Erro ao buscar informações da API externa');
    });
  });

  describe('GET /api/informations', () => {
    it('deve redirecionar para API externa', async () => {
      const mockResponse = { success: true, data: [] };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const request = createMockRequest('http://localhost:3000/api/informations', {
        ocold: '123'
      });

      const response = await getInformations(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/informations/external??ocold=123',
        expect.any(Object)
      );
    });
  });

  describe('Testes de Integração', () => {
    it('deve processar fluxo completo de busca e envio de informações', async () => {
      // 1. Buscar pessoas
      const mockPessoasResponse = {
        content: [
          {
            id: 1,
            nome: 'João Silva',
            idade: 25,
            sexo: 'MASCULINO',
            status: 'DESAPARECIDO',
            ultimaOcorrencia: { ocoId: 123 }
          }
        ],
        totalElements: 1
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPessoasResponse)
      });

      const pessoasRequest = createMockRequest('http://localhost:3000/api/pessoas');
      const pessoasResponse = await getPessoas(pessoasRequest);
      const pessoasData = await pessoasResponse.json();

      expect(pessoasData.data).toHaveLength(1);

      // 2. Enviar informação para a pessoa encontrada
      const mockFormData = createMockFormData({
        personId: '1',
        sightingLocation: 'Centro',
        description: 'Vi a pessoa'
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      // Mock da busca da pessoa
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            id: 1,
            ultimaOcorrencia: { ocoId: 123 }
          }]
        })
      });

      // Mock do envio da informação
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      const infoResponse = await postInformationsExternal(mockRequest);
      const infoData = await infoResponse.json();

      expect(infoResponse.status).toBe(200);
      expect(infoData.success).toBe(true);
    });
  });

  describe('Testes de Performance', () => {
    it('deve ter timeout adequado para requisições externas', async () => {
      const mockFormData = createMockFormData({
        personId: '123',
        sightingLocation: 'Centro',
        description: 'Descrição'
      });

      const mockRequest = {
        formData: () => Promise.resolve(mockFormData)
      } as NextRequest;

      // Mock da busca da pessoa
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: [{
            id: 123,
            ultimaOcorrencia: { ocoId: 456 }
          }]
        })
      });

      // Mock de timeout
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Request timeout')
      );

      const response = await postInformationsExternal(mockRequest);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.error).toBe('Serviço temporariamente indisponível');
    });
  });
});
