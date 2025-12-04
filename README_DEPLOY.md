# 📦 Guia de Deploy - Juvenal CRM

Escolha o método de deploy que prefere:

## 🚀 Método 1: ULTRA SIMPLES (Recomendado)

**Zero configuração. 3 passos. Funciona!**

### Pré-requisito:
- Arquivo `backend/.env` existe no repositório ✅

### Passos:
1. Conectar Git no Easypanel
2. Dockerfile Path: `Dockerfile.simple`
3. Deploy!

**Guia:** [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) (3 minutos)

---

## 🔐 Método 2: Seguro (Configuração Manual)

**Mais seguro. Variáveis no Easypanel.**

### Pré-requisitos:
- Projeto Supabase criado
- Secrets gerados

### Passos:
1. Configurar variáveis de ambiente no Easypanel
2. Dockerfile Path: `Dockerfile`
3. Deploy!

**Guia:** [QUICKSTART.md](./QUICKSTART.md) (5 minutos)

---

## 📊 Comparação

| Critério | Ultra Simples | Seguro |
|----------|---------------|--------|
| **Passos** | 3 | 5 |
| **Configuração** | Zero | Manual |
| **Segurança** | Média* | Alta |
| **Velocidade** | ⚡⚡⚡ | ⚡⚡ |
| **Recomendado para** | Repos privados, testes | Produção, repos públicos |

\* Seguro apenas se repositório for privado

---

## 🎯 Qual Escolher?

### Use **Ultra Simples** se:
- ✅ Repositório é **privado**
- ✅ Quer deploy rápido (3 minutos)
- ✅ Não quer configurar variáveis manualmente

### Use **Seguro** se:
- ✅ Repositório é **público**
- ✅ Produção real
- ✅ Quer máxima segurança

---

## 📚 Documentação Completa

- **Ultra Simples (3 min):** [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md)
- **Seguro Rápido (5 min):** [QUICKSTART.md](./QUICKSTART.md)
- **Completo (30 min):** [DEPLOY.md](./DEPLOY.md)
- **Comparação Técnica:** [DOCKER_FILES.md](./DOCKER_FILES.md)
- **Visão Geral:** [DEPLOY_SUMMARY.md](./DEPLOY_SUMMARY.md)

---

## ⚡ Quick Start

**Para deploy AGORA (3 minutos):**

```bash
# 1. Verifique que backend/.env existe
cat backend/.env

# 2. No Easypanel:
#    - Create App → Build from Source
#    - Dockerfile Path: Dockerfile.simple
#    - Port: 3001
#    - Deploy!

# 3. Pronto! ✅
```

---

## 🔍 Verificar Deploy

Após o deploy, teste:

```bash
# Health check
curl https://seu-app.easypanel.host/api/v1/health

# Frontend
# Abrir no navegador: https://seu-app.easypanel.host
```

---

## 💬 Suporte

- **Problemas?** Veja [DEPLOY_SIMPLE.md](./DEPLOY_SIMPLE.md) → Troubleshooting
- **Dúvidas?** Consulte [DEPLOY.md](./DEPLOY.md) (guia completo)

---

**Deploy feito com ❤️ para Juvenal CRM**
