import { http, HttpResponse } from 'msw';

// Mock data
export const mockPersons = [
  {
    id: 1,
    nome: 'João Silva',
    idade: 25,
    sexo: 'M',
    localizado: false,
    dataDesaparecimento: '2024-01-15',
    localDesaparecimento: 'Cuiabá, MT',
    descricao: 'Desaparecido desde 15/01/2024',
    foto: '/sem-foto.svg',
    contato: '(65) 99999-9999',
    ocoId: 'oco123',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    idade: 30,
    sexo: 'F',
    localizado: true,
    dataDesaparecimento: '2024-01-10',
    localDesaparecimento: 'Várzea Grande, MT',
    descricao: 'Localizada em 20/01/2024',
    foto: '/sem-foto.svg',
    contato: '(65) 88888-8888',
    ocoId: 'oco456',
  },
];

export const mockAbitusResponse = {
  content: mockPersons,
  totalPages: 1,
  totalElements: 2,
  size: 50,
  number: 0,
  first: true,
  last: true,
  numberOfElements: 2,
  empty: false,
};

// Handlers para diferentes cenários
export const handlers = [
  // Sucesso - Lista de pessoas
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
    return HttpResponse.json(mockAbitusResponse);
  }),

  // Sucesso - Pessoa específica
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id === '1') {
      return HttpResponse.json({
        ...mockAbitusResponse,
        content: [mockPersons[0]],
      });
    }
    
    return HttpResponse.json(mockAbitusResponse);
  }),

  // Sucesso - API interna
  http.get('http://localhost:3000/api/pessoas', ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || '1';
    const pageSize = url.searchParams.get('pageSize') || '12';
    
    return HttpResponse.json({
      data: mockPersons,
      total: 2,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: 1,
    });
  }),

  // Sucesso - Estatísticas
  http.get('http://localhost:3000/api/estatisticas', () => {
    return HttpResponse.json({
      totalPessoas: 449,
      pessoasLocalizadas: 23,
      pessoasDesaparecidas: 426,
    });
  }),

  // Sucesso - Envio de informações
  http.post('http://localhost:3000/api/informations', async ({ request }) => {
    const formData = await request.formData();
    
    return HttpResponse.json({
      success: true,
      message: 'Informação enviada com sucesso!',
      id: 'info123',
    });
  }),

  // 404 - Pessoa não encontrada
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id === '999') {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(mockAbitusResponse);
  }),

  // 500 - Erro interno do servidor
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', ({ request }) => {
    const url = new URL(request.url);
    const error = url.searchParams.get('error');
    
    if (error === '500') {
      return new HttpResponse(null, { status: 500 });
    }
    
    return HttpResponse.json(mockAbitusResponse);
  }),

  // Timeout - Simular timeout
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', ({ request }) => {
    const url = new URL(request.url);
    const timeout = url.searchParams.get('timeout');
    
    if (timeout === 'true') {
      // Simular timeout não retornando resposta
      return new Promise(() => {});
    }
    
    return HttpResponse.json(mockAbitusResponse);
  }),

  // Erro de rede
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', ({ request }) => {
    const url = new URL(request.url);
    const networkError = url.searchParams.get('networkError');
    
    if (networkError === 'true') {
      return HttpResponse.error();
    }
    
    return HttpResponse.json(mockAbitusResponse);
  }),
];

// Handlers para cenários de erro específicos
export const errorHandlers = [
  // 404
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
    return new HttpResponse(null, { status: 404 });
  }),

  // 500
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
    return new HttpResponse(null, { status: 500 });
  }),

  // Timeout
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
    return new Promise(() => {});
  }),

  // Erro de rede
  http.get('https://abitus-api.geia.vip/v1/pessoas/aberto/filtro', () => {
    return HttpResponse.error();
  }),
];
