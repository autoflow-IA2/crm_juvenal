# ⚡ Quick Start - Deploy no Easypanel

Guia rápido de 5 minutos para fazer deploy do Juvenal CRM no Easypanel.

## 📦 Pré-requisitos (Prepare Antes)

1. **Supabase Project** - Crie em https://supabase.com
   - Execute as migrations em `supabase/migrations/`
   - Copie `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`

2. **Repositório Git** - Faça push do código para GitHub/GitLab

3. **Secrets** - Gere 2 secrets aleatórios:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   openssl rand -base64 32

   # Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
   ```

## 🚀 Deploy em 5 Passos

### 1️⃣ Criar App no Easypanel

```
1. Login no Easypanel
2. Clique "Create Application"
3. Escolha "Build from Source"
4. Conecte seu repositório Git
5. Selecione a branch (ex: main)
```

### 2️⃣ Configurar Build

```yaml
Build Method: Dockerfile
Dockerfile Path: Dockerfile
Build Context: .
Port: 3001
```

### 3️⃣ Adicionar Variáveis de Ambiente

Cole no Easypanel (aba "Environment"):

```bash
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
API_KEY_SECRET=seu-secret-aleatorio-1
JWT_SECRET=seu-secret-aleatorio-2
ALLOWED_ORIGINS=https://seu-dominio.easypanel.host
```

### 4️⃣ Deploy!

```
1. Clique "Deploy"
2. Aguarde o build (2-5 minutos)
3. ✅ Pronto!
```

### 5️⃣ Testar

Acesse seu app:
```bash
# Frontend
https://seu-app.easypanel.host

# API Health Check
https://seu-app.easypanel.host/api/v1/health
```

---

## ✅ Checklist Pós-Deploy

- [ ] Health check retorna status 200
- [ ] Frontend carrega corretamente
- [ ] Login funciona
- [ ] API endpoints funcionam
- [ ] Domínio customizado configurado (opcional)
- [ ] SSL/HTTPS ativado (automático no Easypanel)

---

## 🔧 Configuração Avançada

### Domínio Customizado

1. No Easypanel: "Domains" → "Add Domain"
2. Configure DNS apontando para o IP do Easypanel
3. Aguarde propagação DNS (até 24h)
4. SSL será configurado automaticamente

### Auto-Deploy

Ative auto-deploy para fazer deploy automaticamente a cada commit:

1. Settings → Auto Deploy → ON
2. Escolha a branch
3. Commit & push → Deploy automático!

### Logs em Tempo Real

```
Easypanel Dashboard → Seu App → Logs
```

---

## 🐛 Troubleshooting Rápido

### ❌ Build Failed

**Erro:** `npm install failed`
```bash
# Solução: Verifique se package.json existe
# Tente: npm cache clean --force localmente
```

**Erro:** `TypeScript errors`
```bash
# Solução: Rode npm run build localmente primeiro
# Corrija erros de tipo antes de fazer deploy
```

### ❌ Runtime Errors

**Erro:** `Health check failing`
```bash
# Verifique:
1. Variáveis de ambiente estão configuradas?
2. SUPABASE_URL está correto?
3. Porta 3001 está exposta?

# Teste logs:
Easypanel → Logs → Veja os erros
```

**Erro:** `CORS blocked`
```bash
# Adicione seu domínio em ALLOWED_ORIGINS:
ALLOWED_ORIGINS=https://seu-dominio.com,https://app.seu-dominio.com
```

**Erro:** `Cannot connect to Supabase`
```bash
# Verifique:
1. SUPABASE_URL correto?
2. SUPABASE_SERVICE_ROLE_KEY correto?
3. Supabase está online?
4. RLS policies estão configuradas?
```

### ❌ Performance Issues

**Container lento:**
```
Easypanel → Settings → Resources
Aumente: CPU (0.5 → 1.0) e RAM (512MB → 1GB)
```

**Build muito lento:**
```
Normal! Primeiro build: 5-10 minutos
Builds seguintes: 2-3 minutos (cache)
```

---

## 📊 Monitoramento

### Métricas

Easypanel Dashboard mostra:
- ✅ CPU Usage
- ✅ Memory Usage
- ✅ Network Traffic
- ✅ Requests/minute

### Logs

Logs em tempo real:
```
Dashboard → Seu App → Logs

Filtros:
- Last 1 hour
- Last 24 hours
- Custom date range
```

### Alertas

Configure alertas no Easypanel:
```
Settings → Alerts
- High CPU usage
- High memory usage
- Container restarts
```

---

## 🔄 Atualizações

### Atualizar Código

```bash
# 1. Faça suas mudanças localmente
git add .
git commit -m "feat: nova feature"
git push

# 2. No Easypanel:
# Se auto-deploy ativado: Deploy automático
# Se não: Clique "Redeploy" manualmente
```

### Atualizar Variáveis

```bash
# 1. Easypanel → Environment
# 2. Edite a variável
# 3. Clique "Save"
# 4. Clique "Redeploy" (necessário!)
```

### Rollback

```bash
# Easypanel → Deployments
# Clique no deploy anterior
# Clique "Redeploy this version"
```

---

## 🔐 Segurança

### Checklist de Segurança

- [ ] Secrets são aleatórios e fortes (≥32 caracteres)
- [ ] SUPABASE_SERVICE_ROLE_KEY nunca exposto no frontend
- [ ] ALLOWED_ORIGINS configurado corretamente
- [ ] HTTPS habilitado (automático no Easypanel)
- [ ] Rate limiting configurado
- [ ] Logs monitorados regularmente

### Boas Práticas

1. **Rotacione secrets a cada 90 dias**
2. **Use domínio customizado** (não use *.easypanel.host em produção)
3. **Habilite 2FA** na conta Easypanel
4. **Backup do Supabase** configurado
5. **Monitore logs** para atividades suspeitas

---

## 📚 Links Úteis

- **Documentação Completa:** [DEPLOY.md](./DEPLOY.md)
- **Easypanel Docs:** https://easypanel.io/docs
- **Supabase Docs:** https://supabase.com/docs
- **Docker Docs:** https://docs.docker.com

---

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. **Criar primeira API Key**
   - Login → API Keys → Criar nova key
   - Use a key para integrar com sistemas externos

2. **Testar API Docs**
   - Acesse `/api-docs` no seu domínio
   - Teste os endpoints interativamente

3. **Configurar Integrações**
   - n8n, Zapier, Make, etc.
   - Use os endpoints REST da API

4. **Adicionar Dados**
   - Clientes
   - Agendamentos
   - Transações financeiras

5. **Monitorar**
   - Configure alertas
   - Revise logs regularmente
   - Monitore métricas

---

## 💬 Suporte

Precisa de ajuda?

1. **Consulte:** [DEPLOY.md](./DEPLOY.md) (guia detalhado)
2. **Logs:** Verifique os logs no Easypanel
3. **Issues:** Abra uma issue no GitHub do projeto

---

## ✨ Pronto!

Seu Juvenal CRM está no ar! 🎉

Acesse: **https://seu-dominio.com**

Deploy feito com ❤️ usando Easypanel
