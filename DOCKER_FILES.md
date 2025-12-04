# 🐳 Docker & Deploy - Resumo dos Arquivos

Todos os arquivos necessários para fazer deploy do Juvenal CRM usando Docker e Easypanel.

## 📁 Estrutura de Arquivos Criados

```
juvenalcrm/
├── 🐳 Dockerfile                    # Full Stack (Backend + Frontend)
├── 🐳 Dockerfile.frontend           # Frontend apenas (Nginx)
├── 🐳 .dockerignore                 # Ignora arquivos no build
├── 🐳 docker-compose.yml            # Teste local com Docker Compose
│
├── backend/
│   └── 🐳 Dockerfile                # Backend apenas (Node.js)
│
├── 📝 .env.production.example       # Exemplo de variáveis de ambiente
│
├── 📖 DEPLOY.md                     # Guia completo de deploy
├── ⚡ QUICKSTART.md                 # Guia rápido (5 minutos)
├── 📋 DOCKER_FILES.md               # Este arquivo
│
├── 🧪 test-docker.sh                # Script de teste (Linux/Mac)
└── 🧪 test-docker.ps1               # Script de teste (Windows)
```

---

## 🎯 Qual Dockerfile Usar?

### Opção 1: Full Stack (Recomendado para Easypanel)

**Use:** `Dockerfile` (raiz do projeto)

```bash
docker build -t juvenalcrm .
docker run -p 3001:3001 juvenalcrm
```

**Características:**
- ✅ Backend + Frontend em um container
- ✅ Configuração mais simples
- ✅ Menor custo (1 container)
- ✅ Sem CORS issues
- 📦 Tamanho: ~150MB
- 🚀 Serve em: `http://localhost:3001`

**Quando usar:**
- Deploy no Easypanel (ideal!)
- Ambientes com recursos limitados
- Aplicação pequena/média
- Deploy simples e rápido

---

### Opção 2: Backend Separado

**Use:** `backend/Dockerfile`

```bash
cd backend
docker build -t juvenalcrm-backend .
docker run -p 3001:3001 juvenalcrm-backend
```

**Características:**
- ✅ Apenas API REST
- ✅ Menor tamanho de imagem
- ✅ Deploy independente
- 📦 Tamanho: ~80MB
- 🚀 API em: `http://localhost:3001/api/v1`

**Quando usar:**
- Frontend deployado em outro lugar
- Microserviços
- Deploy em Vercel/Netlify (frontend) + Easypanel (backend)
- API pública para integrações

---

### Opção 3: Frontend Separado

**Use:** `Dockerfile.frontend`

```bash
docker build -t juvenalcrm-frontend -f Dockerfile.frontend .
docker run -p 80:80 juvenalcrm-frontend
```

**Características:**
- ✅ Apenas React App estático
- ✅ Servido com Nginx
- ✅ Performance máxima
- ✅ Cache otimizado
- 📦 Tamanho: ~25MB
- 🚀 Serve em: `http://localhost`

**Quando usar:**
- Backend em outro servidor
- CDN deployment
- Alta performance necessária
- Separação de concerns

---

## 🚀 Comparação de Opções

| Feature | Full Stack | Backend | Frontend |
|---------|-----------|---------|----------|
| **Containers** | 1 | 1 | 1 |
| **Portas** | 3001 | 3001 | 80 |
| **Tamanho** | ~150MB | ~80MB | ~25MB |
| **Complexidade** | 🟢 Baixa | 🟡 Média | 🟡 Média |
| **CORS** | ✅ Não precisa | ⚠️ Configurar | ⚠️ Configurar |
| **Custo Easypanel** | 💰 1x | 💰💰 2x | 💰💰 2x |
| **Escalabilidade** | 🟡 Limitada | ✅ Alta | ✅ Alta |
| **Recomendado para** | Pequeno/Médio | APIs | SPAs |

---

## 🔧 Variáveis de Ambiente

### Todas as Variáveis (Full Stack)

```bash
# Node
NODE_ENV=production
PORT=3001

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx

# Security
API_KEY_SECRET=xxx
JWT_SECRET=xxx

# CORS
ALLOWED_ORIGINS=https://seu-dominio.com

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Backend Apenas

```bash
# Mesmas variáveis acima
# CORS deve incluir o domínio do frontend
ALLOWED_ORIGINS=https://frontend-dominio.com
```

### Frontend Apenas

```bash
# Variáveis de build (vite)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## 🧪 Testar Localmente

### Linux/Mac

```bash
chmod +x test-docker.sh
./test-docker.sh
```

### Windows (PowerShell)

```powershell
.\test-docker.ps1
```

### Manual (Full Stack)

```bash
# 1. Build
docker build -t juvenalcrm:test .

# 2. Run (configure suas variáveis)
docker run -p 3001:3001 \
  -e SUPABASE_URL=https://xxx.supabase.co \
  -e SUPABASE_SERVICE_ROLE_KEY=xxx \
  -e API_KEY_SECRET=xxx \
  -e JWT_SECRET=xxx \
  -e ALLOWED_ORIGINS=http://localhost:3001 \
  juvenalcrm:test

# 3. Acesse
# Frontend: http://localhost:3001
# API: http://localhost:3001/api/v1
# Health: http://localhost:3001/api/v1/health
```

### Com Docker Compose

```bash
# Full Stack
docker-compose up app

# Separado (backend + frontend)
docker-compose --profile separate up
```

---

## 📊 Build Times & Sizes

### Tempos de Build (aprox)

| Dockerfile | Primeira Build | Rebuild (com cache) |
|------------|---------------|---------------------|
| Full Stack | 5-10 min | 2-3 min |
| Backend | 3-5 min | 1-2 min |
| Frontend | 2-4 min | 1 min |

### Tamanhos de Imagem

| Dockerfile | Compressed | Uncompressed |
|------------|-----------|--------------|
| Full Stack | ~60MB | ~150MB |
| Backend | ~35MB | ~80MB |
| Frontend | ~10MB | ~25MB |

---

## 🎯 Easypanel - Configuração Rápida

### Full Stack (Recomendado)

```yaml
# Build Settings
Build Method: Dockerfile
Dockerfile Path: Dockerfile
Build Context: .
Port: 3001

# Environment Variables
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
API_KEY_SECRET=xxx
JWT_SECRET=xxx
ALLOWED_ORIGINS=https://seu-dominio.easypanel.host
```

### Backend Separado

```yaml
# Build Settings
Build Method: Dockerfile
Dockerfile Path: backend/Dockerfile
Build Context: backend
Port: 3001

# Environment (mesmas do Full Stack)
```

### Frontend Separado

```yaml
# Build Settings
Build Method: Dockerfile
Dockerfile Path: Dockerfile.frontend
Build Context: .
Port: 80

# Environment Variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## 🔍 Health Checks

Todos os Dockerfiles incluem health checks:

### Full Stack & Backend

```bash
curl http://localhost:3001/api/v1/health
```

Resposta esperada:
```json
{
  "success": true,
  "message": "API is running",
  "version": "1.0.0",
  "timestamp": "2025-12-04T22:00:00.000Z"
}
```

### Frontend

```bash
curl http://localhost/health
```

Resposta esperada:
```
healthy
```

---

## 🐛 Troubleshooting

### Build Failed

**Erro:** `COPY failed: no such file`
```bash
# Verifique se você está no diretório correto
pwd  # Deve estar em /juvenalcrm

# Verifique o build context
docker build -t test -f Dockerfile .
                                   ^ deve ser . (ponto)
```

**Erro:** `npm install failed`
```bash
# Limpe o cache do npm
docker build --no-cache -t juvenalcrm .
```

### Runtime Failed

**Erro:** `Cannot connect to Supabase`
```bash
# Verifique as variáveis de ambiente
docker exec -it container-name env | grep SUPABASE

# Teste a conexão manualmente
docker exec -it container-name curl https://xxx.supabase.co
```

**Erro:** `Port already in use`
```bash
# Veja o que está usando a porta
lsof -i :3001  # Linux/Mac
netstat -ano | findstr :3001  # Windows

# Use outra porta
docker run -p 3002:3001 juvenalcrm
```

---

## 📚 Recursos

- **QUICKSTART.md** - Guia rápido de 5 minutos
- **DEPLOY.md** - Guia completo e detalhado
- **.env.production.example** - Exemplo de variáveis
- **test-docker.sh/ps1** - Scripts de teste

---

## ✅ Checklist de Deploy

Antes de fazer deploy no Easypanel:

- [ ] `.dockerignore` configurado
- [ ] Variáveis de ambiente preparadas
- [ ] Secrets gerados (API_KEY_SECRET, JWT_SECRET)
- [ ] Supabase configurado e migrations aplicadas
- [ ] Testado localmente com `test-docker.sh`
- [ ] Health check funcionando
- [ ] Git push feito
- [ ] Easypanel app criada
- [ ] Variáveis configuradas no Easypanel
- [ ] Deploy executado
- [ ] Health check testado em produção
- [ ] Frontend acessível
- [ ] API funcionando

---

## 🎉 Pronto para Deploy!

Escolha sua opção:
- ⚡ **Rápido:** Use [QUICKSTART.md](./QUICKSTART.md)
- 📖 **Completo:** Use [DEPLOY.md](./DEPLOY.md)

**Recomendação:** Use **Opção 1 (Full Stack)** para deploy no Easypanel!

---

Deploy feito com ❤️ usando Docker + Easypanel
