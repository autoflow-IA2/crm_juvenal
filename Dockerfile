# ============================================================
# Dockerfile para Easypanel - Juvenal CRM
# Frontend React + Backend Express + Nginx
# ============================================================

# ==================================
# Stage 1: Build Frontend
# ==================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copiar arquivos de configuração do frontend
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

# Build frontend
RUN npm run build

# ==================================
# Stage 2: Build Backend
# ==================================
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Copiar arquivos do backend
COPY backend/package.json backend/package-lock.json ./
COPY backend/tsconfig.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte do backend
COPY backend/src/ ./src/

# Build backend
RUN npm run build

# ==================================
# Stage 3: Production Runtime
# ==================================
FROM node:20-alpine

WORKDIR /app

# Instalar runtime dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl

# Copiar arquivos de produção do backend
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Copiar backend compilado
COPY --from=backend-builder /app/dist ./dist

# Copiar frontend compilado para Nginx
WORKDIR /usr/share/nginx/html
COPY --from=frontend-builder /app/dist .

# Copiar configuração do Nginx
WORKDIR /app
COPY nginx.conf /etc/nginx/http.d/default.conf

# Remover config padrão do Nginx se existir
RUN rm -f /etc/nginx/http.d/default.conf.default

# Criar configuração do Supervisor
RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:backend]
command=node /app/backend/dist/server.js
directory=/app/backend
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/backend.err.log
stdout_logfile=/var/log/supervisor/backend.out.log
environment=NODE_ENV="production",PORT="3001",API_KEY="vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=",SUPABASE_URL="https://joeltxvtidnquzbzslkq.supabase.co",SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDc2NzU5MSwiZXhwIjoyMDgwMzQzNTkxfQ.2ybUOUb04jyfekKb8blceEBjxjBlokd_ijZSbQfeTVE",ALLOWED_ORIGINS="*"

[program:nginx]
command=nginx -g 'daemon off;'
autostart=true
autorestart=true
stderr_logfile=/var/log/supervisor/nginx.err.log
stdout_logfile=/var/log/supervisor/nginx.out.log
EOF

# Criar script de inicialização
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e

echo "Starting Juvenal CRM Services"
echo "=============================="

# Verificar arquivos
echo "Verifying installation..."
if [ ! -f /app/backend/dist/server.js ]; then
    echo "Backend build not found!"
    exit 1
fi

if [ ! -f /usr/share/nginx/html/index.html ]; then
    echo "Frontend build not found!"
    exit 1
fi

echo "All files present"

# Iniciar serviços
echo "Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Expor porta
EXPOSE 80

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3001

# Iniciar aplicação
CMD ["/app/start.sh"]
