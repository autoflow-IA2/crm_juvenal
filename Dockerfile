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

# Variáveis de ambiente para build do Vite
ENV VITE_SUPABASE_URL=https://joeltxvtidnquzbzslkq.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs

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
