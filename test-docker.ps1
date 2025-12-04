# ================================================
# Script PowerShell para testar Docker no Windows
# Antes de fazer deploy no Easypanel
# ================================================

Write-Host "🧪 Testando Docker Build do Juvenal CRM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se .env existe
if (-not (Test-Path "backend\.env")) {
    Write-Host "❌ Erro: backend\.env não encontrado" -ForegroundColor Red
    Write-Host "Crie o arquivo backend\.env com as variáveis necessárias"
    Write-Host "Veja .env.production.example para referência"
    exit 1
}

Write-Host "✅ Arquivo backend\.env encontrado" -ForegroundColor Green
Write-Host ""

# Opções de teste
Write-Host "Escolha o que testar:"
Write-Host "  1) Full Stack (Backend + Frontend) - Recomendado"
Write-Host "  2) Backend apenas"
Write-Host "  3) Frontend apenas"
Write-Host "  4) Todos (separados com Docker Compose)"
Write-Host ""

$option = Read-Host "Opção (1-4)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "🔨 Building Full Stack..." -ForegroundColor Yellow
        docker build -t juvenalcrm:test -f Dockerfile .

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build falhou!" -ForegroundColor Red
            exit 1
        }

        Write-Host ""
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Iniciando container..."

        # Load env vars from backend/.env
        Get-Content backend\.env | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }

        docker run -d `
            --name juvenalcrm-test `
            -p 3001:3001 `
            -e NODE_ENV=production `
            -e PORT=3001 `
            -e SUPABASE_URL="$env:SUPABASE_URL" `
            -e SUPABASE_SERVICE_ROLE_KEY="$env:SUPABASE_SERVICE_ROLE_KEY" `
            -e API_KEY_SECRET="$env:API_KEY_SECRET" `
            -e JWT_SECRET="$env:JWT_SECRET" `
            -e ALLOWED_ORIGINS="http://localhost:3001" `
            juvenalcrm:test

        Write-Host ""
        Write-Host "✅ Container iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📡 Aguardando servidor iniciar..."
        Start-Sleep -Seconds 5

        Write-Host ""
        Write-Host "🧪 Testando endpoints..."
        Write-Host ""

        # Test health endpoint
        Write-Host "  Testing /api/v1/health..."
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/api/v1/health" -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ Health check OK" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ❌ Health check FAILED" -ForegroundColor Red
        }

        # Test frontend
        Write-Host "  Testing frontend (/)..."
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/" -UseBasicParsing
            if ($response.StatusCode -eq 200) {
                Write-Host "  ✅ Frontend OK" -ForegroundColor Green
            }
        } catch {
            Write-Host "  ❌ Frontend FAILED" -ForegroundColor Red
        }

        Write-Host ""
        Write-Host "✅ Testes concluídos!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Acesse: http://localhost:3001"
        Write-Host "📊 API Docs: http://localhost:3001/api-docs"
        Write-Host "❤️  Health: http://localhost:3001/api/v1/health"
        Write-Host ""
        Write-Host "📋 Ver logs:"
        Write-Host "  docker logs -f juvenalcrm-test"
        Write-Host ""
        Write-Host "🛑 Parar container:"
        Write-Host "  docker stop juvenalcrm-test; docker rm juvenalcrm-test"
    }

    "2" {
        Write-Host ""
        Write-Host "🔨 Building Backend..." -ForegroundColor Yellow
        docker build -t juvenalcrm-backend:test -f backend\Dockerfile backend\

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build falhou!" -ForegroundColor Red
            exit 1
        }

        Write-Host ""
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Iniciando container..."

        Get-Content backend\.env | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
            }
        }

        docker run -d `
            --name juvenalcrm-backend-test `
            -p 3001:3001 `
            -e NODE_ENV=production `
            -e PORT=3001 `
            -e SUPABASE_URL="$env:SUPABASE_URL" `
            -e SUPABASE_SERVICE_ROLE_KEY="$env:SUPABASE_SERVICE_ROLE_KEY" `
            -e API_KEY_SECRET="$env:API_KEY_SECRET" `
            -e JWT_SECRET="$env:JWT_SECRET" `
            -e ALLOWED_ORIGINS="http://localhost:5173" `
            juvenalcrm-backend:test

        Write-Host ""
        Write-Host "✅ Backend rodando!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 API: http://localhost:3001/api/v1"
        Write-Host "❤️  Health: http://localhost:3001/api/v1/health"
    }

    "3" {
        Write-Host ""
        Write-Host "🔨 Building Frontend..." -ForegroundColor Yellow
        docker build -t juvenalcrm-frontend:test -f Dockerfile.frontend .

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build falhou!" -ForegroundColor Red
            exit 1
        }

        Write-Host ""
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Iniciando container..."

        docker run -d `
            --name juvenalcrm-frontend-test `
            -p 8080:80 `
            juvenalcrm-frontend:test

        Write-Host ""
        Write-Host "✅ Frontend rodando!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Acesse: http://localhost:8080"
    }

    "4" {
        Write-Host ""
        Write-Host "🔨 Building com Docker Compose..." -ForegroundColor Yellow
        docker-compose --profile separate build

        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Build falhou!" -ForegroundColor Red
            exit 1
        }

        Write-Host ""
        Write-Host "✅ Build concluído!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Iniciando containers..."
        docker-compose --profile separate up -d

        Write-Host ""
        Write-Host "✅ Containers rodando!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌐 Frontend: http://localhost"
        Write-Host "🌐 Backend: http://localhost:3001/api/v1"
    }

    default {
        Write-Host "❌ Opção inválida" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "================================================"
Write-Host ""
