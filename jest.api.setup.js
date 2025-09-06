// Configuração global para testes de API
global.fetch = jest.fn();

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
};

// Mock do AbortSignal.timeout se não estiver disponível
if (!global.AbortSignal.timeout) {
  global.AbortSignal.timeout = jest.fn(() => new AbortController().signal);
}

// Configurar timeout padrão para fetch
const originalFetch = global.fetch;
global.fetch = jest.fn((...args) => {
  return originalFetch(...args);
});

// Mock de dados de teste
global.mockApiData = {
  pessoas: {
    content: [
      {
        id: 1,
        nome: 'João Silva',
        idade: 25,
        sexo: 'MASCULINO',
        status: 'DESAPARECIDO',
        ultimaOcorrencia: { ocoId: 123 }
      },
      {
        id: 2,
        nome: 'Maria Santos',
        idade: 30,
        sexo: 'FEMININO',
        status: 'LOCALIZADO',
        ultimaOcorrencia: { ocoId: 456 }
      }
    ],
    totalElements: 2,
    totalPages: 1
  },
  estatisticas: {
    total: 100,
    localizadas: 25
  },
  informacoes: {
    id: 1,
    informacoes: 'Informação de teste',
    data: '2024-01-15',
    local: 'Centro da cidade'
  }
};
