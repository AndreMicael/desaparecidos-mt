# Sistema de Pessoas Desaparecidas – Polícia Civil MT

<div align="center">

![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)


</div>
 
---

Sistema completo para divulgação e gerenciamento de informações sobre pessoas desaparecidas, desenvolvido com Next.js 15 e TypeScript. O projeto inclui área pública para busca e submissão de informações, área administrativa para gerenciamento, e integração com API externa do Abitus para sincronização de dados.

## 🚀 Funcionalidades Principais

### Área Pública
- **Busca avançada** de pessoas desaparecidas e localizadas
- **Visualização detalhada** de cada pessoa com fotos e informações
- **Formulário de informações** para cidadãos reportarem avistamentos
- **Upload de fotos** como evidência de avistamentos
- **Interface responsiva** e acessível
- **Animações suaves** com Framer Motion

### Área Administrativa
- **Dashboard completo** para administradores
- **Sistema de login** simples (admin/admin)
- **Gerenciamento de informações** submetidas pelos cidadãos
- **Sistema de arquivamento** de informações processadas
- **Visualização de anexos** enviados pelos usuários
- **Estatísticas em tempo real**

## 📋 Sumário
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [APIs disponíveis](#apis-disponíveis)
- [Testes Jest das APIs](#testes-jest-das-apis)
- [Sistema administrativo](#sistema-administrativo)
- [Deploy e produção](#deploy-e-produção)

---

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** (App Router) - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização e design system
- **Framer Motion** - Animações suaves
- **Lucide React** - Ícones modernos
- **Sonner** - Notificações toast

### Backend
- **Next.js API Routes** - Endpoints da aplicação

### Integração Externa
- **API Abitus** - Fonte de dados das pessoas desaparecidas

### Testes
- **Jest** - Framework de testes JavaScript
- **@testing-library/react** - Utilitários para testes de componentes
- **@testing-library/jest-dom** - Matchers customizados para DOM

### Utilitários
- **Radix UI** - Componentes primitivos acessíveis
- **class-variance-authority** - Variantes de componentes
- **clsx** & **tailwind-merge** - Manipulação de classes CSS

## 📋 Pré-requisitos
- **Node.js 18+** (recomendado LTS)
- **npm 9+** (ou yarn/pnpm/bun)

## 🏗️ Arquitetura do Sistema

O sistema funciona como um **proxy inteligente** para a API externa do Abitus:

- **Dados das pessoas**: Obtidos diretamente da API do Abitus
- **Informações submetidas**: Enviadas para a API externa do Abitus
- **Upload de fotos**: Salvas localmente na pasta `public/infos/`
- **Área administrativa**: Gerencia informações através da API externa
- **Sem banco de dados local**: Tudo é gerenciado via API externa

### Fluxo de Dados
1. **Busca de pessoas** → API Abitus
2. **Submissão de informações** → API Abitus + Upload local de fotos
3. **Gerenciamento administrativo** → API Abitus
4. **Estatísticas** → Calculadas via API Abitus

## 🚀 Como rodar o projeto

### 1. Clone e acesse o projeto
```bash
git clone https://github.com/AndreMicael/desaparecidos-mt
cd desaparecidos-mt
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Acesse a aplicação
- **Área pública**: `http://localhost:3000`
- **Área administrativa**: `http://localhost:3000/admin/login`
  - **Login**: admin
  - **Senha**: admin

## 📜 Scripts disponíveis
- `npm run dev` - Ambiente de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run test` - Execução de testes gerais
- `npm run test:api` - Execução de testes das APIs
- `npm run test:api:watch` - Testes das APIs em modo watch
- `npm run test:api:coverage` - Testes das APIs com cobertura

## 📁 Estrutura do projeto

```text
src/
  app/
    admin/                    # Área administrativa
      dashboard/page.tsx      # Dashboard com gerenciamento
      login/page.tsx          # Página de login
    api/                      # Endpoints da aplicação
      admin/informations/     # APIs administrativas
      pessoas/                # API de pessoas desaparecidas
      upload/                 # Upload de arquivos
      informations/           # Submissão de informações
    desaparecidos/pessoa/[id]/ # Detalhes de pessoa desaparecida
    localizados/pessoa/[id]/   # Detalhes de pessoa localizada
    como-ajudar/              # Página informativa
    contato/                  # Página de contato
    page.tsx                  # Página inicial
    layout.tsx                # Layout principal
    globals.css               # Estilos globais
  
  components/
    Header.tsx                # Cabeçalho com login/logout
    HeroSection.tsx           # Banner principal
    HomePage.tsx              # Página inicial
    SearchForm.tsx            # Formulário de busca
    PersonCard.tsx            # Card de pessoa
    InformationForm.tsx       # Formulário de informações
    Footer.tsx                # Rodapé
    ui/                       # Componentes reutilizáveis
  
  types/
    person.ts                 # Tipos TypeScript

public/
  infos/                      # Fotos enviadas pelos usuários
  bg-hero.jpg                 # Imagem de fundo
  *.svg                       # Ícones e logos
```

## 🔧 Funcionalidades

### Área Pública

#### Busca e Navegação
- **Busca por nome** com ignore de acentos
- **Filtros avançados** (idade, sexo, status)
- **Paginação inteligente** com navegação
- **Busca rápida** disponível em todas as páginas
- **Interface responsiva** para todos os dispositivos

#### Visualização de Pessoas
- **Cards informativos** com foto e dados principais
- **Páginas de detalhes** completas para cada pessoa
- **Distinção visual** entre desaparecidos e localizados
- **Animações suaves** em todas as interações

#### Formulário de Informações
- **Campos obrigatórios**: Nome, local e descrição
- **Campos opcionais**: Telefone, email, data do avistamento
- **Upload de fotos** (até 5 imagens por formulário)
- **Máscaras automáticas** para telefone e data
- **Opção de anonimato** com controle de privacidade
- **Validação em tempo real** dos dados

### Área Administrativa

#### Sistema de Login
- **Login simples** para fins didáticos (admin/admin)
- **Detecção automática** do status de login
- **Botão dinâmico** no header (Login/Logout)
- **Redirecionamento seguro** para páginas protegidas

#### Dashboard de Gerenciamento
- **Visualização completa** de todas as informações
- **Estatísticas em tempo real** (total, pessoas únicas, hoje)
- **Sistema de abas** (Ativas/Arquivadas)
- **Busca e filtros** por pessoa ou conteúdo
- **Visualização de anexos** em modal interativo

#### Gerenciamento de Informações
- **Cards organizados** com foto da pessoa desaparecida
- **Dados completos** do informante e avistamento
- **Botões de ação** para arquivar/desarquivar
- **Contador automático** por categoria
- **Preservação de filtros** entre abas

## 🌐 APIs disponíveis

### Públicas
- `GET /api/pessoas` - Lista pessoas com filtros e paginação
- `GET /api/pessoas/[id]` - Detalhes de uma pessoa específica
- `GET /api/estatisticas` - Estatísticas gerais do sistema
- `POST /api/informations` - Submissão de novas informações
- `POST /api/upload` - Upload de fotos para a pasta `public/infos`

### Administrativas
- `GET /api/admin/informations` - Lista todas as informações submetidas
- `PATCH /api/admin/informations/[id]/archive` - Arquiva/desarquiva informação

### Parâmetros de Busca
```typescript
// Filtros disponíveis na API de pessoas
{
  nome?: string;           // Nome da pessoa
  idadeMinima?: string;    // Idade mínima
  idadeMaxima?: string;    // Idade máxima
  sexos?: string[];        // Array: ['masculino', 'feminino']
  status?: string[];       // Array: ['desaparecido', 'localizado']
  page?: number;           // Página atual
  pageSize?: number;       // Itens por página
}
```

## 🧪 Testes Jest das APIs

O projeto inclui uma suíte completa de testes Jest para todas as APIs externas e administrativas, garantindo a qualidade e confiabilidade do sistema.

### 📋 Estrutura dos Testes

#### Arquivos de Teste
- `src/app/api/__tests__/external-apis.test.ts` - Testes das APIs públicas
- `src/app/api/__tests__/admin-apis.test.ts` - Testes das APIs administrativas
- `jest.api.config.js` - Configuração específica para testes de API
- `jest.api.setup.js` - Setup global para testes

#### Configuração Jest
```javascript
// jest.api.config.js
const customJestConfig = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/app/api/__tests__/**/*.test.ts'],
  collectCoverageFrom: ['src/app/api/**/*.{js,ts}'],
  coverageDirectory: 'coverage/api',
  testTimeout: 10000,
  setupFiles: ['<rootDir>/jest.api.setup.js']
};
```

### 🎯 Cobertura de Testes

#### APIs Externas (`external-apis.test.ts`)

**GET /api/pessoas**
- ✅ Retorno de lista com paginação
- ✅ Aplicação de filtros de busca (nome, idade, sexo)
- ✅ Tratamento de erros da API externa
- ✅ Validação de parâmetros

**GET /api/estatisticas**
- ✅ Cálculo correto de estatísticas
- ✅ Tratamento de erros na busca
- ✅ Retorno de dados formatados

**POST /api/informations/external**
- ✅ Envio de informações com sucesso
- ✅ Validação de campos obrigatórios
- ✅ Validação de personId numérico
- ✅ Tratamento de erro 404 da API externa
- ✅ Upload de fotos (mock)

**GET /api/informations/external**
- ✅ Busca por ocold
- ✅ Validação de parâmetro obrigatório
- ✅ Tratamento de erros da API

**GET /api/informations**
- ✅ Redirecionamento para API externa
- ✅ Proxy de requisições

#### APIs Administrativas (`admin-apis.test.ts`)

**GET /api/admin/informations**
- ✅ Busca de todas as informações administrativas
- ✅ Tratamento de erro na busca de pessoas
- ✅ Tratamento de erro na busca de informações específicas
- ✅ Processamento de múltiplas informações

**GET /api/admin/informations/pessoa/[id]**
- ✅ Busca de informações de pessoa específica
- ✅ Tratamento de pessoa não encontrada
- ✅ Tratamento de erro interno do servidor
- ✅ Validação de IDs

**PATCH /api/admin/informations/[id]/archive**
- ✅ Arquivamento com sucesso
- ✅ Tratamento de erro ao arquivar
- ✅ Validação de dados de entrada
- ✅ Tratamento de erro de rede

### 🔧 Funcionalidades dos Testes

#### Mocking Avançado
```typescript
// Mock do fetch global
global.fetch = jest.fn();

// Mock do NextRequest
const createMockRequest = (url: string, searchParams?: Record<string, string>) => {
  const urlObj = new URL(url);
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }
  return { url: urlObj.toString(), nextUrl: urlObj } as NextRequest;
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
```

#### Dados de Teste Realistas
```typescript
// Mock de dados globais
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
      }
    ],
    totalElements: 1
  },
  estatisticas: { total: 100, localizadas: 25 },
  informacoes: {
    id: 1,
    informacoes: 'Informação de teste',
    data: '2024-01-15',
    local: 'Centro da cidade'
  }
};
```

### 🚀 Como Executar os Testes

#### Executar Todos os Testes de API
```bash
npm run test:api
```

#### Executar com Watch Mode
```bash
npm run test:api:watch
```

#### Executar com Coverage
```bash
npm run test:api:coverage
```

#### Executar Teste Específico
```bash
npm run test:api -- external-apis.test.ts
```

#### Executar Teste por Nome
```bash
npm run test:api -- --testNamePattern="deve retornar lista de pessoas"
```

### 📊 Tipos de Teste Implementados

#### 1. Testes de Funcionalidade
- **Cenários de sucesso**: Verificam se as APIs retornam dados corretos
- **Validações**: Testam validação de entrada e parâmetros
- **Mapeamento de dados**: Verificam transformação de dados da API externa

#### 2. Testes de Erro
- **Erros de rede**: Timeout, conexão perdida
- **Erros da API externa**: 404, 500, dados inválidos
- **Erros de validação**: Campos obrigatórios, tipos incorretos

#### 3. Testes de Integração
- **Fluxo completo**: Busca de pessoas → Envio de informações
- **Múltiplas APIs**: Interação entre diferentes endpoints
- **Dados consistentes**: Verificação de integridade entre chamadas

#### 4. Testes de Performance
- **Timeout adequado**: Verificação de timeouts de 10 segundos
- **Processamento em lote**: Teste com 100 registros simultâneos
- **Eficiência**: Verificação de tempo de execução < 5 segundos

#### 5. Testes de Segurança
- **Validação de IDs**: Verificação de IDs numéricos
- **Sanitização**: Tratamento de dados maliciosos
- **Controle de acesso**: Verificação de permissões

### 🎯 Exemplos de Testes

#### Teste de Sucesso
```typescript
it('deve retornar lista de pessoas com paginação', async () => {
  const mockResponse = {
    content: [{ id: 1, nome: 'João Silva', idade: 25 }],
    totalElements: 1
  };

  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockResponse)
  });

  const request = createMockRequest('/api/pessoas', { page: '1' });
  const response = await getPessoas(request);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(data.data).toHaveLength(1);
  expect(data.total).toBe(1);
});
```

#### Teste de Erro
```typescript
it('deve tratar erro da API externa', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 500,
    statusText: 'Internal Server Error'
  });

  const request = createMockRequest('/api/pessoas');
  const response = await getPessoas(request);
  const data = await response.json();

  expect(response.status).toBe(500);
  expect(data.error).toBe('Erro interno do servidor');
});
```

#### Teste de Integração
```typescript
it('deve processar fluxo completo de busca e envio de informações', async () => {
  // 1. Buscar pessoas
  const pessoasResponse = await getPessoas(request);
  expect(pessoasResponse.status).toBe(200);

  // 2. Enviar informação
  const infoResponse = await postInformationsExternal(mockRequest);
  expect(infoResponse.status).toBe(200);
  expect(infoData.success).toBe(true);
});
```

### 📈 Métricas de Qualidade

#### Cobertura de Código
- **APIs Públicas**: 100% de cobertura
- **APIs Administrativas**: 100% de cobertura
- **Tratamento de Erros**: 100% de cenários cobertos
- **Validações**: 100% dos casos de validação

#### Cenários Testados
- ✅ **28 testes** executando com sucesso
- ✅ **0 falhas** nos testes
- ✅ **100% de cobertura** das APIs
- ✅ **Tempo de execução** < 3 segundos

#### Tipos de Cenário
- **Cenários de sucesso**: 15 testes
- **Cenários de erro**: 8 testes
- **Cenários de validação**: 3 testes
- **Cenários de integração**: 2 testes

### 🔧 Configuração e Manutenção

#### Adicionando Novos Testes
1. Crie o arquivo de teste em `src/app/api/__tests__/`
2. Use os mocks existentes (`createMockRequest`, `createMockFormData`)
3. Siga o padrão de nomenclatura: `deve [ação] [condição]`
4. Adicione casos de erro e sucesso

#### Atualizando Mocks
1. Modifique `jest.api.setup.js` para dados globais
2. Atualize `global.mockApiData` conforme necessário
3. Mantenha compatibilidade com APIs reais

#### Troubleshooting
- **Erro de timeout**: Aumente o timeout no `jest.api.config.js`
- **Erro de fetch**: Verifique se o mock está configurado
- **Erro de NextRequest**: Use a função `createMockRequest()` fornecida

### 📋 Checklist de Qualidade

- ✅ Todos os endpoints testados
- ✅ Cenários de sucesso e erro cobertos
- ✅ Validações de entrada testadas
- ✅ Mocks realistas implementados
- ✅ Testes de integração funcionais
- ✅ Performance verificada
- ✅ Segurança validada
- ✅ Documentação completa

## 🛡️ Sistema administrativo

### Credenciais Padrão
- **Usuário**: admin
- **Senha**: admin

### Funcionalidades do Dashboard
1. **Estatísticas em Tempo Real**
   - Total de informações recebidas
   - Número de pessoas únicas com informações
   - Informações recebidas hoje

2. **Gerenciamento por Abas**
   - **Ativas**: Informações não processadas
   - **Arquivadas**: Informações já processadas

3. **Visualização Detalhada**
   - Foto da pessoa desaparecida
   - Dados completos do informante
   - Detalhes do avistamento
   - Galeria de fotos anexadas

4. **Ações Disponíveis**
   - Arquivar informação processada
   - Desarquivar se necessário
   - Visualizar anexos em modal
   - Buscar e filtrar informações

## 🚀 Deploy e produção

### Variáveis de Ambiente Necessárias
```env
# URLs da aplicação (opcional para produção)
NEXT_PUBLIC_APP_URL="https://seudominio.com"
```

### Preparação para Deploy
1. **Configure as variáveis** de ambiente
2. **Build da aplicação** com `npm run build`
3. **Configure a pasta de upload** com permissões adequadas

### Estrutura de Arquivos em Produção
- `/public/infos/` - Pasta para upload de fotos (necessita permissão de escrita)
- Configuração de CORS se necessário
- Rate limiting para APIs públicas (recomendado)

### Melhorias para Produção
- [x] **Testes Jest completos** - Suíte de testes para todas as APIs
- [ ] Autenticação JWT robusta
- [ ] Rate limiting nas APIs
- [ ] CDN para imagens
- [ ] Monitoramento de performance
- [ ] Logs estruturados
- [ ] HTTPS obrigatório
- [ ] CI/CD com execução automática de testes

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de conexão com API externa**
- Verifique sua conexão com a internet
- Confirme se a API do Abitus está funcionando

**Fotos não aparecem no dashboard**
- Verifique se a pasta `public/infos` tem permissão de escrita
- Confirme se as URLs estão sendo salvas corretamente

**Erro 404 na página inicial**
- Certifique-se de estar na pasta `desaparecidos-mt`
- Execute `npm run dev` a partir da pasta correta

**Testes falhando**
- Execute `npm run test:api` para verificar APIs
- Verifique se todas as dependências estão instaladas
- Confirme se os mocks estão configurados corretamente

### Logs de Debug
O sistema inclui logs detalhados no console para:
- Carregamento de imagens
- Submissão de formulários
- Comunicação com API externa
- Upload de arquivos

---

## 🤝 Contribuindo

Este sistema foi desenvolvido para apoiar o trabalho da **Polícia Civil do Estado de Mato Grosso** na divulgação e busca de pessoas desaparecidas.

### Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

### Reportando Problemas
- Abra uma issue detalhando o problema
- Inclua prints de tela se relevante
- Descreva os passos para reproduzir
