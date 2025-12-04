# 🚀 Deploy Simples - 3 Passos

Deploy do Juvenal CRM no Easypanel em **3 passos** sem configuração manual.

## ✅ Pré-requisito

Certifique-se que o arquivo `backend/.env` existe com as credenciais corretas.

**Verificar:**
```bash
cat backend/.env
```

**Deve conter:**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=xxx
API_KEY_SECRET=xxx
JWT_SECRET=xxx
```

✅ Se estiver tudo ok, prossiga!

---

## 📦 Deploy em 3 Passos

### 1️⃣ Conectar Repositório

No Easypanel:
1. Clique **"Create Application"**
2. Escolha **"Build from Source"**
3. Conecte seu repositório Git (GitHub/GitLab)
4. Selecione a branch: **`main`**

---

### 2️⃣ Configurar Build

Configure o build:

```
Build Method: Dockerfile
Dockerfile Path: Dockerfile.simple
Build Context: .
Port: 3001
```

**Importante:** Use exatamente `Dockerfile.simple` como path!

---

### 3️⃣ Deploy!

1. Clique **"Deploy"**
2. Aguarde o build (3-5 minutos)
3. ✅ **Pronto!**

Acesse:
- **Frontend:** `https://seu-app.easypanel.host`
- **API:** `https://seu-app.easypanel.host/api/v1`
- **Health:** `https://seu-app.easypanel.host/api/v1/health`

---

## 🎯 Isso é Tudo!

Não precisa:
- ❌ Configurar variáveis de ambiente
- ❌ Copiar credenciais do Supabase
- ❌ Gerar secrets
- ❌ Configurar CORS
- ❌ Configurar nada!

O `backend/.env` é copiado automaticamente para o container.

---

## ✅ Testar Localmente (Opcional)

Se quiser testar antes de fazer deploy:

```bash
# Build
docker build -t juvenalcrm -f Dockerfile.simple .

# Run
docker run -p 3001:3001 juvenalcrm

# Acesse
# Frontend: http://localhost:3001
# API: http://localhost:3001/api/v1/health
```

---

## 🔍 Verificar Deploy

Após o deploy, verifique se está funcionando:

**Health Check:**
```bash
curl https://seu-app.easypanel.host/api/v1/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API is running",
  "version": "1.0.0"
}
```

**Frontend:**
- Abra `https://seu-app.easypanel.host` no navegador
- Deve carregar a página de login

---

## 🔄 Atualizar Código

### Auto-Deploy (Recomendado)

Ative auto-deploy no Easypanel:
1. **Settings** → **Auto Deploy** → **ON**
2. Escolha a branch: **main**

Agora toda vez que fizer commit:
```bash
git add .
git commit -m "feat: nova feature"
git push
```

→ Deploy automático acontece! 🎉

### Deploy Manual

Se auto-deploy estiver desativado:
1. Faça commit e push normalmente
2. No Easypanel: clique **"Redeploy"**

---

## 🐛 Troubleshooting

### ❌ Build Failed

**Erro:** `npm install failed`

**Solução:**
```bash
# Teste localmente
npm install
cd backend && npm install

# Se funcionar local, tente deploy novamente
```

---

**Erro:** `backend/.env not found`

**Solução:**
```bash
# Certifique-se que o arquivo existe
ls backend/.env

# Verifique que está commitado no Git
git status
git add backend/.env
git commit -m "chore: add env file"
git push
```

---

### ❌ Runtime Failed

**Erro:** `Health check failing`

**Verifique logs no Easypanel:**
```
Dashboard → Logs → Ver mensagens de erro
```

**Erros comuns:**
- Variável de ambiente faltando no `.env`
- Supabase URL incorreto
- Porta diferente de 3001

---

**Erro:** `Cannot connect to Supabase`

**Verifique:**
1. `SUPABASE_URL` está correto em `backend/.env`
2. `SUPABASE_SERVICE_ROLE_KEY` está correto
3. Supabase está online: https://supabase.com/dashboard

---

### ❌ Frontend Não Carrega

**Erro:** Página em branco

**Verifique:**
1. Acesse `/api/v1/health` - se funcionar, backend está ok
2. Veja logs no navegador (F12 → Console)
3. Verifique logs do container no Easypanel

---

## 🔐 Segurança

**⚠️ IMPORTANTE:**

Se este é um repositório **público** no GitHub, **NÃO commite** o `backend/.env` com credenciais reais!

**Opções seguras:**
1. Use repositório **privado** no GitHub/GitLab
2. OU use variáveis de ambiente no Easypanel (modo tradicional - veja QUICKSTART.md)
3. OU use o `Dockerfile` normal (mais seguro, mas precisa configurar env vars)

Se o repositório é **privado** → Tudo ok! ✅

---

## 🎓 Recursos

- **Documentação Completa:** [DEPLOY.md](./DEPLOY.md)
- **Opções Avançadas:** [DOCKER_FILES.md](./DOCKER_FILES.md)
- **Supabase Docs:** https://supabase.com/docs
- **Easypanel Docs:** https://easypanel.io/docs

---

## 💡 Por Que Funciona?

O `Dockerfile.simple` faz automaticamente:

1. ✅ Builda o frontend (React + Vite)
2. ✅ Builda o backend (Express + TypeScript)
3. ✅ Copia o `backend/.env` para o container
4. ✅ Configura servidor que serve frontend + API juntos
5. ✅ Expõe porta 3001
6. ✅ Configura health check

Tudo em um único container! 🎯

---

## ✨ Pronto!

Deploy simples e rápido! 🚀

Qualquer dúvida, consulte [README_DEPLOY.md](./README_DEPLOY.md) para escolher entre deploy simples ou seguro.
