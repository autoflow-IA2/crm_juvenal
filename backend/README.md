# Juvenal CRM - Backend API

REST API para integração do Juvenal CRM com sistemas externos (n8n, Zapier, Make, etc.)

## 🚀 Quick Start

### 1. Configuração

```bash
# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas credenciais do Supabase
# Obtenha a SERVICE_ROLE_KEY em: Supabase Dashboard > Project Settings > API
```

### 2. Rodar Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

### 3. Testar

```bash
# Health check
curl http://localhost:3001/health
```

## 📡 Endpoints

Documentação completa em: `docs/API_REFERENCE.md`

### Base URL
```
Development: http://localhost:3001/api/v1
Production:  https://api.juvenalcrm.com/api/v1
```

### Autenticação
```
Header: X-API-Key: your-api-key-here
```

## 🔐 Obter API Key

1. Acesse o Juvenal CRM
2. Vá em Perfil > API Keys
3. Clique em "Gerar Nova API Key"
4. Copie a key (mostrada apenas uma vez!)

## 📚 Documentação

- [API Reference](../docs/API_REFERENCE.md) - Documentação completa de todos os endpoints
- [n8n Integration Guide](../docs/N8N_INTEGRATION.md) - Guia de integração com n8n
- [Postman Collection](../docs/POSTMAN_COLLECTION.json) - Collection para testar

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express 4.x
- **Language**: TypeScript 5.x
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod 3.x
- **Security**: Helmet + CORS + Rate Limiting

## 📋 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm start` - Inicia servidor de produção
- `npm test` - Roda testes
- `npm run lint` - Verifica código com ESLint

## 🌍 Variáveis de Ambiente

Ver `.env.example` para lista completa.

Principais:
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (atenção: bypassa RLS!)
- `API_KEY_SECRET` - Secret para hash das API keys
- `ALLOWED_ORIGINS` - Domínios permitidos para CORS
- `PORT` - Porta do servidor (padrão: 3001)

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` com credenciais reais
- A `SERVICE_ROLE_KEY` bypassa Row Level Security - use com cuidado
- API keys são mostradas apenas UMA vez durante a criação
- Mantenha `API_KEY_SECRET` seguro e único

## 📞 Suporte

Para problemas ou dúvidas, veja a documentação completa ou abra uma issue.
