# Sistema de Pessoas Desaparecidas – Polícia Civil MT

Documentação do projeto `desaparecidos-mt`, desenvolvido com foco em performance, acessibilidade e fidelidade visual ao protótipo fornecido. Esta aplicação não possui autenticação e concentra-se na busca e divulgação de informações de pessoas desaparecidas.

## Sumário
- [Tecnologias](#tecnologias)
- [Pré‑requisitos](#pré-requisitos)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Arquitetura e principais componentes](#arquitetura-e-principais-componentes)
- [Estilos, tema e fonte](#estilos-tema-e-fonte)
- [Background do Hero](#background-do-hero)
- [Mock API e modelos](#mock-api-e-modelos)
- [Boas práticas de desenvolvimento](#boas-práticas-de-desenvolvimento)
- [Pendências e próximos passos](#pendências-e-próximos-passos)
- [Dúvidas comuns (FAQ)](#dúvidas-comuns-faq)

---

## Tecnologias
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS (com tokens CSS customizados)
- Lucide React (ícones)
- Sonner (toasts)
- Radix UI primitives (Checkbox/Slot)
- Utilitários: `class-variance-authority`, `clsx`, `tailwind-merge`

## Pré-requisitos
- Node.js 18+ (recomendado LTS)
- npm 9+ (ou yarn/pnpm/bun, se preferir)

## Como rodar o projeto
1. Acesse a pasta do projeto (importante: entre na subpasta `desaparecidos-mt`):
```powershell
cd desaparecidos-mt
```
2. Instale as dependências:
```bash
npm install
```
3. Rode o servidor de desenvolvimento:
```bash
npm run dev
```
4. Abra o navegador em `http://localhost:3000` (ou a porta exibida no terminal).

> Dica (Windows/PowerShell): evite usar `cd projeto && npm run dev`. Use comandos separados se o PowerShell não aceitar `&&`.

## Scripts disponíveis
- `npm run dev`: inicia o ambiente de desenvolvimento.
- `npm run build`: gera a aplicação para produção.
- `npm run start`: inicia o servidor após o build.

## Estrutura de pastas
```text
src/
  app/
    page.tsx           # Ponto de entrada, renderiza a HomePage
    layout.tsx         # Define a fonte Encode Sans e importa os estilos globais
    globals.css        # Tokens de tema (CSS variables) e utilitários
  components/
    HomePage.tsx       # Orquestra a página inicial (busca, paginação, abas)
    Header.tsx         # Cabeçalho com contatos e menu
    HeroSection.tsx    # Banner com imagem de fundo e formulário compacto
    SearchForm.tsx     # Formulário (nome, idade, sexo, status)
    PersonCard.tsx     # Card de pessoa
    Footer.tsx         # Rodapé com parceiros e contatos
    ui/                # Componentes de UI reutilizáveis (Button, Input, etc.)
  services/
    api.ts             # Mock API (busca/estatísticas)
  types/
    person.ts          # Tipos: Person, SearchFilters, etc.
public/
  bg-hero.jpg          # Imagem do herói (banner)
  *.svg                # Ícones estáticos
```

## Arquitetura e principais componentes
- `src/app/page.tsx`: componente client que apenas delega para `HomePage` e registra o `Toaster`.
- `src/components/HomePage.tsx`:
  - Integra o `Header`, `HeroSection`, `SearchForm`, `PersonCard` e `Footer`.
  - Controla tabs (Desaparecidos/Localizados/Como Ajudar/Contato), busca, paginação e estatísticas.
- `src/components/HeroSection.tsx`:
  - Exibe título, subtítulo, cartões de estatística e o formulário de busca compacto.
  - Usa `bg-hero.jpg` como plano de fundo.
- `src/components/SearchForm.tsx`:
  - Campos: nome, idade mínima/máxima, sexo (masculino/feminino) e status (desaparecido/localizado).
  - Ações: Buscar e Limpar.
- `src/components/PersonCard.tsx`:
  - Mostra foto, nome, idade estimada, sexo, datas e local.
  - Badge de status (Desaparecido/Localizado).
- `src/services/api.ts` (mock):
  - `searchPersons({ page, pageSize, filters })`
  - `getPersonStatistics()`

## Estilos, tema e fonte
- A fonte padrão do projeto é **Encode Sans**, carregada via `next/font` em `src/app/layout.tsx`:
  - A classe global `font-sans` e a utilitária `font-encode-sans` usam a variável `--font-encode-sans`.
- Tokens de tema em `globals.css` (modo claro/escuro por CSS variables). Principais tokens:
  - `--background`, `--foreground`, `--primary`, `--secondary`, `--border`, etc.
- Tailwind configurado em `tailwind.config.ts` com `@tailwindcss/line-clamp` para truncar textos.

## Background do Hero
- Arquivo: `public/bg-hero.jpg`.
- Implementação atual (simplificada e performática):
  - Repetição horizontal (`repeat-x`).
  - Overlay escuro para garantir legibilidade.
- Para trocar a imagem, substitua `public/bg-hero.jpg` mantendo o mesmo nome/razão de aspecto.

## Mock API e modelos
- Tipos em `src/types/person.ts`:
  - `Person`: estrutura base da pessoa.
  - `SearchFilters`: filtros do formulário de busca.
  - `Statistics`: totais exibidos no banner.
- Os dados vêm de `src/services/api.ts` (simulado). Para integrar com uma API real:
  1. Crie variáveis de ambiente (`.env.local`) com a URL base do backend.
  2. Substitua as funções do mock por `fetch`/`axios` no serviço.
  3. Garanta que os tipos de resposta coincidam com os modelos do front.

## Boas práticas de desenvolvimento
- Componentes client-only devem iniciar com `"use client"`.
- Prefira componentes reutilizáveis em `src/components/ui`.
- Use `clsx`/`tailwind-merge` para classes condicionais (helper `cn`).
- Ícones via `lucide-react` para consistência visual.
- Toasters via `sonner` (tema claro por padrão).
- Mantenha nomes explícitos e código legível (Clean Code).

## Pendências e próximos passos
- Página de detalhes da pessoa (`PersonDetail`) e navegação ao clicar no card.
- Componente de mapa de proximidade (presente no protótipo) ainda não implementado.
- Integração com API real da instituição (quando disponível).

## Dúvidas comuns (FAQ)
- "Ao rodar `npm run dev` aparece ENOENT package.json":
  - Certifique-se de que você está dentro da pasta `desaparecidos-mt` antes de rodar o comando.
- "PowerShell não aceita `&&`":
  - Execute os comandos em linhas separadas: `cd desaparecidos-mt` e depois `npm run dev`.
- "Toast falha por `next-themes` não encontrado":
  - O projeto usa `Sonner` em tema fixo claro; não é necessário `next-themes`.

---

Feito com ❤️ para apoiar o trabalho da Polícia Civil do Estado de Mato Grosso. Se notar qualquer problema ou tiver sugestões, abra uma issue ou envie um PR.