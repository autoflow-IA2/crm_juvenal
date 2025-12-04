# Juvenal CRM - REST API

Sistema completo de CRM para clínicas de terapia e coaching com API REST para integração externa.

## 🎯 Visão Geral

Juvenal CRM agora possui uma **API REST completa** com 37 endpoints para integração com sistemas externos como n8n, Zapier, Make e outras ferramentas de automação.

## 🚀 Quick Start

### 1. Instalar Backend

```bash
cd backend
npm install
```

### 2. Configurar Ambiente

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
NODE_ENV=development
PORT=3001

# Supabase (obtenha no dashboard)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Security (gere valores únicos)
API_KEY_SECRET=seu-secret-aqui
JWT_SECRET=seu-jwt-secret-aqui

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Aplicar Migration de API Keys

No Supabase Dashboard > SQL Editor, execute:
```sql
-- Conteúdo de supabase/migrations/005_api_keys.sql
```

### 4. Iniciar Servidor

```bash
npm run dev
```

Servidor rodando em: **http://localhost:3001** ✅

### 5. Criar Primeira API Key

```bash
# Obtenha seu user_id no Supabase Dashboard > Authentication > Users
npx ts-node scripts/create-first-api-key.ts <seu_user_id>
```

**⚠️ IMPORTANTE:** Guarde a API key - ela é mostrada apenas UMA vez!

### 6. Testar

```bash
curl -H "X-API-Key: sua_key_aqui" \
  http://localhost:3001/api/v1/health
```

## 📡 API Endpoints

### Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://api.juvenalcrm.com/api/v1
```

### Recursos Disponíveis

| Recurso | Endpoints | Descrição |
|---------|-----------|-----------|
| API Keys | 7 | Gerenciar chaves de API |
| Clientes | 8 | CRUD + busca + estatísticas |
| Agendamentos | 10 | Gestão de consultas completa |
| Transações | 12 | Controle financeiro + dashboard |
| **Total** | **37** | **Endpoints REST** |

## 🔐 Autenticação

Todas as rotas (exceto `/health`) requerem API Key:

```bash
curl -H "X-API-Key: jcrm_live_your_key_here" \
  http://localhost:3001/api/v1/clients
```

## 📚 Documentação

### Completa
- **[API Reference](docs/API_REFERENCE.md)** - Documentação completa de todos os 37 endpoints
- **[Guia n8n](docs/N8N_INTEGRATION.md)** - Integração com n8n + 5 workflows prontos

### Exemplos Rápidos

**Listar Clientes:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  "http://localhost:3001/api/v1/clients?page=1&limit=50"
```

**Criar Cliente:**
```bash
curl -X POST \
  -H "X-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","phone":"11987654321","status":"active"}' \
  http://localhost:3001/api/v1/clients
```

**Próximos Agendamentos:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  "http://localhost:3001/api/v1/appointments/upcoming?limit=10"
```

**Dashboard Financeiro:**
```bash
curl -H "X-API-Key: YOUR_KEY" \
  "http://localhost:3001/api/v1/transactions/dashboard"
```

## 🤖 Integração n8n

Automatize tudo com n8n! Ver [Guia Completo](docs/N8N_INTEGRATION.md)

### Workflows Prontos

1. **Novo Lead** → Criar cliente automaticamente
2. **Pagamento** → Registrar transação
3. **Lembrete** → Enviar notificação
4. **Relatório** → Email mensal
5. **Reativação** → Campanha para inativos

## 🛡️ Segurança

- ✅ API Keys com hash SHA-256
- ✅ Row Level Security (RLS)
- ✅ Rate limiting (100 req/min)
- ✅ CORS configurável
- ✅ Helmet security headers
- ✅ Validação Zod
- ✅ Scopes (read/write/delete)

## 🔧 Stack Tecnológico

```
Node.js 18+ + Express 4 + TypeScript 5
├── Supabase (PostgreSQL)
├── Zod (validation)
├── Helmet (security)
├── CORS
├── Rate Limiting
└── Compression
```

## 📊 Features

- ✅ 37 endpoints REST
- ✅ Autenticação via API Key
- ✅ Paginação automática
- ✅ Filtros avançados
- ✅ Busca full-text
- ✅ Dashboard financeiro
- ✅ Relatórios mensais
- ✅ Error handling robusto
- ✅ Documentação completa
- ✅ Rate limiting
- ✅ CORS configurável

## 🚀 Deploy

### Opções de Deploy

1. **Render** (recomendado)
2. **Railway**
3. **Fly.io**
4. **Heroku**
5. **VPS próprio**

### Variáveis de Ambiente (Produção)

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
API_KEY_SECRET=...
JWT_SECRET=...
ALLOWED_ORIGINS=https://seu-dominio.com
```

## 📈 Performance

- **Rate Limit:** 100 requests/minuto
- **Response Time:** < 200ms (média)
- **Paginação:** Até 100 resultados/página
- **Compression:** gzip ativado
- **Cache Headers:** configuráveis

## 🧪 Testes

```bash
npm test              # Rodar todos os testes
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 📝 Changelog

### v1.0.0 (2025-01-15)

**Backend API - Lançamento Inicial:**
- ✅ 37 endpoints REST
- ✅ Autenticação via API Key
- ✅ Sistema de permissões (scopes)
- ✅ Rate limiting
- ✅ Documentação completa
- ✅ Guia de integração n8n
- ✅ 5 workflows de exemplo

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

- 📖 [Documentação Completa](docs/API_REFERENCE.md)
- 🤖 [Guia n8n](docs/N8N_INTEGRATION.md)
- 💬 [Issues](https://github.com/seu-usuario/juvenalcrm/issues)

## 📄 Licença

MIT License

---

**Juvenal CRM API** - Integre, automatize e escale! 🚀
