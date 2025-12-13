# ============================================================
# Dockerfile para Easypanel - Juvenal CRM
# Frontend React + Vite + Nginx
# ============================================================

# ==================================
# Stage 1: Build Frontend
# ==================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json package-lock.json ./
COPY tsconfig.json tsconfig.node.json vite.config.ts ./
COPY index.html ./
COPY postcss.config.js tailwind.config.js ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY src/ ./src/
COPY public/ ./public/

# Variáveis de ambiente para build do Vite
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build
RUN npm run build

# ==================================
# Stage 2: Production (Nginx)
# ==================================
FROM nginx:alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build do frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Expor porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
