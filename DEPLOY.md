# 🚀 Deploy no Easypanel - Juvenal CRM

Este guia explica como fazer deploy do Juvenal CRM no Easypanel.

## 📋 Pré-requisitos

1. **Conta no Easypanel** com servidor configurado
2. **Repositório Git** (GitHub, GitLab, etc.) com o código
3. **Supabase Project** com as tabelas criadas (use as migrations em `supabase/migrations/`)

## 🎯 Opções de Deploy

### Opção 1: Full Stack (Recomendado)

Deploy de **Backend + Frontend** em um único container.

**Vantagens:**
- Configuração mais simples
- Menor custo (1 container apenas)
- Sem problemas de CORS

**Dockerfile:** Use o `Dockerfile` na raiz do projeto

### Opção 2: Separado

Deploy de **Backend** e **Frontend** em containers separados.

**Vantagens:**
- Escalabilidade independente
- Deploy independente de cada parte

**Dockerfiles:**
- Backend: `backend/Dockerfile`
- Frontend: `Dockerfile.frontend`

---

## 🔧 Configuração no Easypanel

### 1️⃣ Criar Nova Aplicação

1. Acesse seu painel Easypanel
2. Clique em **"Create Application"**
3. Selecione **"Build from Source"**
4. Conecte seu repositório Git

### 2️⃣ Configurar Build

**Para Full Stack (Opção 1):**

- **Build Method:** Dockerfile
- **Dockerfile Path:** `Dockerfile`
- **Build Context:** `.` (raiz do projeto)
- **Port:** `3001`

**Para Backend Separado (Opção 2):**

- **Build Method:** Dockerfile
- **Dockerfile Path:** `backend/Dockerfile`
- **Build Context:** `backend/`
- **Port:** `3001`

**Para Frontend Separado (Opção 2):**

- **Build Method:** Dockerfile
- **Dockerfile Path:** `Dockerfile.frontend`
- **Build Context:** `.`
- **Port:** `80`

### 3️⃣ Variáveis de Ambiente

Configure as seguintes variáveis no Easypanel:

```bash
# Node Environment
NODE_ENV=production

# Server Port
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key

# Security Secrets
API_KEY_SECRET=sua-chave-secreta-para-api-keys
JWT_SECRET=sua-chave-secreta-para-jwt

# CORS (ajuste para seus domínios)
ALLOWED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4️⃣ Configurar Domínio

1. No Easypanel, vá para **"Domains"**
2. Adicione seu domínio customizado ou use o subdomínio fornecido
3. Easypanel configura SSL automaticamente

### 5️⃣ Deploy

1. Clique em **"Deploy"**
2. Acompanhe os logs de build
3. Aguarde o deploy finalizar
4. Acesse sua aplicação!

---

## 🔍 Verificação Pós-Deploy

### Health Check

Teste se a API está funcionando:

```bash
curl https://seu-dominio.com/api/v1/health
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

### Endpoints da API

- **Health:** `GET /api/v1/health`
- **API Docs:** Acesse pelo frontend em `/api-docs`
- **API Keys:** `GET /api/v1/api-keys` (requer autenticação)
- **Clients:** `GET /api/v1/clients` (requer API key)
- **Appointments:** `GET /api/v1/appointments` (requer API key)
- **Transactions:** `GET /api/v1/transactions` (requer API key)

### Frontend

Acesse `https://seu-dominio.com` para ver a aplicação React.

---

## 🧪 Teste Local (Antes do Deploy)

Para testar os containers Docker localmente:

### Full Stack (Opção 1):

```bash
# Build
docker build -t juvenalcrm:latest .

# Run (adicione suas variáveis de ambiente)
docker run -p 3001:3001 \
  -e SUPABASE_URL=https://seu-projeto.supabase.co \
  -e SUPABASE_SERVICE_ROLE_KEY=sua-key \
  -e API_KEY_SECRET=secret \
  -e JWT_SECRET=secret \
  juvenalcrm:latest

# Acesse: http://localhost:3001
```

### Com Docker Compose:

```bash
# 1. Crie um arquivo .env na raiz com suas variáveis
cp backend/.env .env

# 2. Rode o stack completo
docker-compose up app

# Ou rode backend e frontend separados
docker-compose --profile separate up
```

---

## 🐛 Troubleshooting

### Build Failed

**Erro:** `npm install failed`
- Verifique se `package.json` e `package-lock.json` existem
- Tente limpar o cache: adicione `RUN npm cache clean --force` no Dockerfile

**Erro:** `TypeScript compilation failed`
- Verifique erros de tipo no código
- Rode `npm run build` localmente primeiro

### Runtime Errors

**Erro:** `Cannot connect to Supabase`
- Verifique as variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`
- Confirme que as tabelas foram criadas no Supabase

**Erro:** `CORS blocked`
- Adicione seu domínio em `ALLOWED_ORIGINS`
- Formato: `https://dominio1.com,https://dominio2.com`

**Erro:** `Health check failing`
- Verifique os logs do container no Easypanel
- Teste o endpoint `/api/v1/health` manualmente

### Performance

**Container lento:**
- Aumente os recursos (CPU/RAM) no Easypanel
- Verifique se há muitos logs sendo gerados

**Build muito demorado:**
- Use cache layers do Docker corretamente
- Considere fazer build localmente e deploy da imagem pronta

---

## 📊 Monitoramento

### Logs

Acesse os logs em tempo real no Easypanel:
- Clique na aplicação
- Vá para **"Logs"**
- Filtre por data/hora

### Métricas

Easypanel fornece métricas de:
- CPU usage
- Memory usage
- Network traffic
- Requests per minute

---

## 🔄 Atualizações

### Deploy Automático

Configure **auto-deploy** no Easypanel:
1. Vá para **"Settings"**
2. Ative **"Auto Deploy"**
3. Escolha a branch (ex: `main`)
4. Toda vez que houver commit, deploy automático acontece

### Deploy Manual

1. Faça commit e push das mudanças
2. No Easypanel, clique em **"Redeploy"**
3. Acompanhe o build
4. Zero downtime deploy!

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] Variáveis de ambiente configuradas (não hardcoded)
- [ ] `API_KEY_SECRET` e `JWT_SECRET` são strings aleatórias fortes
- [ ] CORS configurado apenas para domínios necessários
- [ ] HTTPS habilitado (Easypanel faz automaticamente)
- [ ] Rate limiting configurado
- [ ] Supabase RLS (Row Level Security) habilitado

### Boas Práticas

1. **Nunca comite arquivos `.env`** no Git
2. **Rotacione secrets regularmente** (JWT_SECRET, API_KEY_SECRET)
3. **Use diferentes secrets** para produção e desenvolvimento
4. **Habilite 2FA** na sua conta Easypanel
5. **Monitore logs** para atividades suspeitas

---

## 📞 Suporte

### Recursos Úteis

- **Easypanel Docs:** https://easypanel.io/docs
- **Docker Docs:** https://docs.docker.com
- **Supabase Docs:** https://supabase.com/docs

### Issues Comuns

Consulte as issues no repositório GitHub do projeto ou crie uma nova descrevendo o problema com:
- Logs do container
- Variáveis de ambiente (sem expor secrets!)
- Steps para reproduzir o erro

---

## 🎉 Pronto!

Sua aplicação Juvenal CRM está rodando no Easypanel! 🚀

Acesse:
- **Frontend:** https://seu-dominio.com
- **API:** https://seu-dominio.com/api/v1
- **Docs:** https://seu-dominio.com/api-docs
