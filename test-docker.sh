#!/bin/bash

# ================================================
# Script para testar Docker localmente
# Antes de fazer deploy no Easypanel
# ================================================

set -e

echo "🧪 Testando Docker Build do Juvenal CRM"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se .env existe
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ Erro: backend/.env não encontrado${NC}"
    echo "Crie o arquivo backend/.env com as variáveis necessárias"
    echo "Veja .env.production.example para referência"
    exit 1
fi

echo "✅ Arquivo backend/.env encontrado"
echo ""

# Opções de teste
echo "Escolha o que testar:"
echo "  1) Full Stack (Backend + Frontend) - Recomendado"
echo "  2) Backend apenas"
echo "  3) Frontend apenas"
echo "  4) Todos (separados)"
echo ""
read -p "Opção (1-4): " option

case $option in
    1)
        echo ""
        echo -e "${YELLOW}🔨 Building Full Stack...${NC}"
        docker build -t juvenalcrm:test -f Dockerfile .

        echo ""
        echo -e "${GREEN}✅ Build concluído!${NC}"
        echo ""
        echo "🚀 Iniciando container..."

        # Load env vars
        export $(cat backend/.env | xargs)

        docker run -d \
            --name juvenalcrm-test \
            -p 3001:3001 \
            -e NODE_ENV=production \
            -e PORT=3001 \
            -e SUPABASE_URL="${SUPABASE_URL}" \
            -e SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}" \
            -e API_KEY_SECRET="${API_KEY_SECRET}" \
            -e JWT_SECRET="${JWT_SECRET}" \
            -e ALLOWED_ORIGINS="http://localhost:3001" \
            juvenalcrm:test

        echo ""
        echo -e "${GREEN}✅ Container iniciado!${NC}"
        echo ""
        echo "📡 Aguardando servidor iniciar..."
        sleep 5

        echo ""
        echo "🧪 Testando endpoints..."
        echo ""

        # Test health endpoint
        echo "  Testing /api/v1/health..."
        if curl -f http://localhost:3001/api/v1/health > /dev/null 2>&1; then
            echo -e "  ${GREEN}✅ Health check OK${NC}"
        else
            echo -e "  ${RED}❌ Health check FAILED${NC}"
        fi

        # Test frontend
        echo "  Testing frontend (/)..."
        if curl -f http://localhost:3001/ > /dev/null 2>&1; then
            echo -e "  ${GREEN}✅ Frontend OK${NC}"
        else
            echo -e "  ${RED}❌ Frontend FAILED${NC}"
        fi

        echo ""
        echo -e "${GREEN}✅ Testes concluídos!${NC}"
        echo ""
        echo "🌐 Acesse: http://localhost:3001"
        echo "📊 API Docs: http://localhost:3001/api-docs"
        echo "❤️  Health: http://localhost:3001/api/v1/health"
        echo ""
        echo "📋 Ver logs:"
        echo "  docker logs -f juvenalcrm-test"
        echo ""
        echo "🛑 Parar container:"
        echo "  docker stop juvenalcrm-test && docker rm juvenalcrm-test"
        ;;

    2)
        echo ""
        echo -e "${YELLOW}🔨 Building Backend...${NC}"
        docker build -t juvenalcrm-backend:test -f backend/Dockerfile backend/

        echo ""
        echo -e "${GREEN}✅ Build concluído!${NC}"
        echo ""
        echo "🚀 Iniciando container..."

        export $(cat backend/.env | xargs)

        docker run -d \
            --name juvenalcrm-backend-test \
            -p 3001:3001 \
            -e NODE_ENV=production \
            -e PORT=3001 \
            -e SUPABASE_URL="${SUPABASE_URL}" \
            -e SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}" \
            -e API_KEY_SECRET="${API_KEY_SECRET}" \
            -e JWT_SECRET="${JWT_SECRET}" \
            -e ALLOWED_ORIGINS="http://localhost:5173" \
            juvenalcrm-backend:test

        echo ""
        echo -e "${GREEN}✅ Backend rodando!${NC}"
        echo ""
        echo "🌐 API: http://localhost:3001/api/v1"
        echo "❤️  Health: http://localhost:3001/api/v1/health"
        ;;

    3)
        echo ""
        echo -e "${YELLOW}🔨 Building Frontend...${NC}"
        docker build -t juvenalcrm-frontend:test -f Dockerfile.frontend .

        echo ""
        echo -e "${GREEN}✅ Build concluído!${NC}"
        echo ""
        echo "🚀 Iniciando container..."

        docker run -d \
            --name juvenalcrm-frontend-test \
            -p 8080:80 \
            juvenalcrm-frontend:test

        echo ""
        echo -e "${GREEN}✅ Frontend rodando!${NC}"
        echo ""
        echo "🌐 Acesse: http://localhost:8080"
        ;;

    4)
        echo ""
        echo -e "${YELLOW}🔨 Building com Docker Compose...${NC}"
        docker-compose --profile separate build

        echo ""
        echo -e "${GREEN}✅ Build concluído!${NC}"
        echo ""
        echo "🚀 Iniciando containers..."
        docker-compose --profile separate up -d

        echo ""
        echo -e "${GREEN}✅ Containers rodando!${NC}"
        echo ""
        echo "🌐 Frontend: http://localhost"
        echo "🌐 Backend: http://localhost:3001/api/v1"
        ;;

    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo ""
