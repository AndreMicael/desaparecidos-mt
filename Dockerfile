# ================================
# Stage 1: Build da aplicação
# ================================
FROM node:24-bullseye-slim AS builder

# Instalar dependências do sistema necessárias para o build
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro (para cache de layers)
COPY package.json package-lock.json* ./

# Configurar variáveis de ambiente
ENV npm_config_cache=/tmp/.npm
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Instalar dependências básicas primeiro
RUN npm install --legacy-peer-deps

# Instalar lightningcss separadamente com build from source
RUN npm install lightningcss@latest --build-from-source --force

# Rebuild de todas as dependências nativas
RUN npm rebuild --build-from-source

# Limpar cache
RUN npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação Next.js
RUN npm run build

# ================================
# Stage 2: Imagem de produção
# ================================
FROM node:24-alpine3.21 AS runner

# Instalar dependências do sistema mínimas
RUN apk add --no-cache \
    libc6-compat \
    libstdc++ \
    && rm -rf /var/cache/apk/*

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Definir diretório de trabalho
WORKDIR /app

# Definir variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Copiar arquivos necessários do stage de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Alterar propriedade dos arquivos para o usuário nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expor porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
