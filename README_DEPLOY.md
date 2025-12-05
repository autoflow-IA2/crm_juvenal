# 📦 Guia de Deploy - Juvenal CRM

Escolha o método de deploy que prefere:

---

## 🚀 Método 1: ULTRA SIMPLES (Recomendado)

**✅ Zero configuração. 3 passos. Funciona!**

### Quando usar:
- ✅ Repositório Git é **privado**
- ✅ Quer deploy rápido (3 minutos)
- ✅ Não quer configurar variáveis manualmente

### Como fazer:
1. **Conectar Git** no Easypanel
2. **Dockerfile Path:** `Dockerfile.simple`
3. **Port:** `3001`
4. **Deploy!**

**📖 Guia completo:** [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) (3 minutos)

---

## 🔐 Método 2: Seguro (Configuração Manual)

**✅ Mais seguro. Variáveis no Easypanel.**

### Quando usar:
- ✅ Repositório é **público**
- ✅ Deploy para produção real
- ✅ Quer máxima segurança

### Como fazer:
1. Configurar variáveis de ambiente no Easypanel
2. **Dockerfile Path:** `Dockerfile`
3. **Port:** `3001`
4. **Deploy!**

**📖 Guia completo:** [QUICKSTART.md](./QUICKSTART.md) (5 minutos)

---

## 📊 Comparação Rápida

| Critério | Ultra Simples | Seguro |
|----------|---------------|--------|
| **Passos** | 3 | 5 |
| **Tempo** | 3 min | 5 min |
| **Configuração** | Zero | Manual (7 variáveis) |
| **Segurança** | Média* | Alta |
| **Recomendado para** | Repos privados, testes | Repos públicos, produção |

\* *Seguro apenas se repositório for privado*

---

## ⚡ Quick Start - ULTRA SIMPLES

```bash
# 1. Verifique que backend/.env existe
cat backend/.env

# 2. No Easypanel:
#    Create App → Build from Source
#    Dockerfile Path: Dockerfile.simple
#    Build Context: .
#    Port: 3001
#    Deploy!

# 3. Pronto! ✅
```

**Acesse:**
- Frontend: `https://seu-app.easypanel.host`
- API: `https://seu-app.easypanel.host/api/v1/health`

---

## 🎯 Qual Escolher?

### Use **Ultra Simples** se:
- ✅ Repositório é **privado** no GitHub/GitLab
- ✅ Quer deploy o mais rápido possível
- ✅ Não quer configurar 7+ variáveis manualmente
- ✅ É para desenvolvimento/homologação

### Use **Seguro** se:
- ✅ Repositório é **público**
- ✅ Deploy para produção crítica
- ✅ Precisa de segurança máxima
- ✅ Quer controle total das variáveis

---

## 📚 Documentação Completa

| Arquivo | Conteúdo | Tempo |
|---------|----------|-------|
| [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) | **Deploy em 3 passos** (ultra simples) | 3 min |
| [QUICKSTART.md](./QUICKSTART.md) | Deploy seguro (configuração manual) | 5 min |
| [DEPLOY.md](./DEPLOY.md) | Guia completo e detalhado | 30 min |
| [DOCKER_FILES.md](./DOCKER_FILES.md) | Comparação técnica de Dockerfiles | 10 min |
| [DEPLOY_SUMMARY.md](./DEPLOY_SUMMARY.md) | Visão geral executiva | 5 min |

---

## 🔍 Verificar Deploy (Ambos os Métodos)

Após deploy bem-sucedido:

```bash
# Health check da API
curl https://seu-app.easypanel.host/api/v1/health

# Resposta esperada:
{
  "success": true,
  "message": "API is running",
  "version": "1.0.0"
}
```

**Frontend:**
- Abrir no navegador: `https://seu-app.easypanel.host`
- Deve carregar página de login

---

## 🔄 Atualizações Automáticas

**Ative auto-deploy (ambos os métodos):**

1. Easypanel → **Settings** → **Auto Deploy** → **ON**
2. Escolha branch: **main**

Agora todo commit faz deploy automático:
```bash
git add .
git commit -m "feat: nova feature"
git push
# → Deploy automático! 🎉
```

---

## 🐛 Problemas?

### Build falhou?
- Veja logs no Easypanel: Dashboard → Logs
- Verifique `backend/.env` existe (método simples)
- Verifique variáveis configuradas (método seguro)

### Health check falha?
```bash
# Teste manualmente
curl https://seu-app.easypanel.host/api/v1/health

# Verifique:
# - Supabase está online?
# - Credenciais corretas no .env?
# - Porta 3001 exposta?
```

### Frontend em branco?
- Abra Console do navegador (F12)
- Verifique erros de JavaScript
- Confirme que `/api/v1/health` funciona

**📖 Troubleshooting completo:** Veja [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md#troubleshooting) ou [QUICKSTART.md](./QUICKSTART.md#troubleshooting)

---

## 💡 Diferença Entre os Dockerfiles

### `Dockerfile.simple`
- Copia `backend/.env` automaticamente
- Zero configuração no Easypanel
- Perfeito para repos privados
- **3 passos para deploy**

### `Dockerfile`
- Variáveis via Easypanel
- Máxima segurança
- Para repos públicos
- **5 passos para deploy**

Ambos servem frontend + backend no mesmo container!

---

## 🎓 Recursos Externos

- **Easypanel Docs:** https://easypanel.io/docs
- **Supabase Docs:** https://supabase.com/docs
- **Docker Docs:** https://docs.docker.com

---

## ✨ Próximos Passos

**Após deploy bem-sucedido:**

1. ✅ **Configurar domínio customizado**
   - Easypanel → Domains → Add Domain
   - SSL automático

2. ✅ **Ativar auto-deploy**
   - Settings → Auto Deploy → ON

3. ✅ **Monitorar logs**
   - Dashboard → Logs → Real-time

4. ✅ **Criar primeira API Key**
   - Login no app → API Keys → Create

5. ✅ **Configurar integrações**
   - Use endpoints REST em n8n, Zapier, etc.

---

## 🚀 Começar Agora!

**Para deploy IMEDIATO (3 minutos):**

👉 **[Abrir DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md)**

**Para deploy seguro (5 minutos):**

👉 **[Abrir QUICKSTART.md](./QUICKSTART.md)**

---

**Deploy feito com ❤️ para Juvenal CRM**
