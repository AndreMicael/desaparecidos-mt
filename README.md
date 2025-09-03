# Sistema de Pessoas Desaparecidas – Polícia Civil MT

<div align="center">

![React](https://img.shields.io/badge/React-19.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)


</div>

---

Sistema completo para divulgação e gerenciamento de informações sobre pessoas desaparecidas, desenvolvido com Next.js 15, TypeScript e MySQL. O projeto inclui área pública para busca e submissão de informações, área administrativa para gerenciamento, e integração com API externa do Abitus para sincronização de dados.

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
- [Configuração do Banco](#configuração-do-banco)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [APIs disponíveis](#apis-disponíveis)
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
- **MySQL** - Banco de dados principal
- **Prisma** - ORM para gerenciamento do banco
- **Next.js API Routes** - Endpoints da aplicação

### Integração Externa
- **API Abitus** - Fonte de dados das pessoas desaparecidas

### Utilitários
- **Radix UI** - Componentes primitivos acessíveis
- **class-variance-authority** - Variantes de componentes
- **clsx** & **tailwind-merge** - Manipulação de classes CSS

## 📋 Pré-requisitos
- **Node.js 18+** (recomendado LTS)
- **npm 9+** (ou yarn/pnpm/bun)
- **MySQL 8.0+** - Banco de dados

## 🗃️ Configuração do Banco

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="mysql://usuario:senha@host:porta/database"
```

### Estrutura do Banco
O sistema criará automaticamente as seguintes tabelas:
- `informations` - Informações submetidas pelos cidadãos
- `photos` - Metadados das fotos (opcional para expansão futura)

### Campos da Tabela `informations`:
- `id` - Identificador único
- `personId` - ID da pessoa desaparecida
- `informantName` - Nome do informante
- `informantPhone` - Telefone (opcional)
- `informantEmail` - Email (opcional)
- `sightingDate` - Data do avistamento
- `sightingLocation` - Local do avistamento
- `description` - Descrição detalhada
- `photos` - URLs das fotos (separadas por vírgula)
- `archived` - Status de arquivamento
- `archivedAt` - Data do arquivamento
- `createdAt` / `updatedAt` - Timestamps

## 🚀 Como rodar o projeto

### 1. Clone e acesse o projeto
```bash
git clone [url-do-repositorio]
cd desaparecidos/desaparecidos-mt
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados
```bash
# Configure suas variáveis de ambiente no arquivo .env
DATABASE_URL="mysql://usuario:senha@host:porta/database"
```

### 4. Execute o servidor de desenvolvimento
```bash
npm run dev
```

### 5. Acesse a aplicação
- **Área pública**: `http://localhost:3000`
- **Área administrativa**: `http://localhost:3000/admin/login`
  - **Login**: admin
  - **Senha**: admin

## 📜 Scripts disponíveis
- `npm run dev` - Ambiente de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run test` - Execução de testes

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

prisma/
  schema.prisma               # Esquema do banco de dados
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
# Banco de dados
DATABASE_URL="mysql://usuario:senha@host:porta/database"

# URLs da aplicação (opcional para produção)
NEXT_PUBLIC_APP_URL="https://seudominio.com"
```

### Preparação para Deploy
1. **Configure o banco de dados** em produção
2. **Execute as migrações** do Prisma
3. **Gere o cliente** Prisma para produção
4. **Configure as variáveis** de ambiente
5. **Build da aplicação** com `npm run build`

### Estrutura de Arquivos em Produção
- `/public/infos/` - Pasta para upload de fotos (necessita permissão de escrita)
- Configuração de CORS se necessário
- Rate limiting para APIs públicas (recomendado)

### Melhorias para Produção
- [ ] Autenticação JWT robusta
- [ ] Rate limiting nas APIs
- [ ] Backup automático do banco
- [ ] CDN para imagens
- [ ] Monitoramento de performance
- [ ] Logs estruturados
- [ ] HTTPS obrigatório

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro: "Cannot find module 'mysql2'"**
```bash
npm install mysql2
```

**Erro: "DATABASE_URL not found"**
- Verifique se o arquivo `.env` existe na raiz
- Confirme a string de conexão MySQL

**Fotos não aparecem no dashboard**
- Verifique se a pasta `public/infos` tem permissão de escrita
- Confirme se as URLs estão sendo salvas corretamente

**Erro 404 na página inicial**
- Certifique-se de estar na pasta `desaparecidos-mt`
- Execute `npm run dev` a partir da pasta correta

### Logs de Debug
O sistema inclui logs detalhados no console para:
- Carregamento de imagens
- Submissão de formulários
- Operações do banco de dados
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

**Desenvolvido com ❤️ para salvar vidas e reunir famílias.**
