# Juvenal CRM - API Reference

Documentação completa da REST API do Juvenal CRM.

## 📡 Base URL

```
Development: http://localhost:3001/api/v1
Production:  https://api.juvenalcrm.com/api/v1
```

## 🔐 Autenticação

Todas as rotas (exceto `/health`) requerem autenticação via API Key.

**Header:**
```
X-API-Key: jcrm_live_your_api_key_here
```

**Exemplo:**
```bash
curl -H "X-API-Key: jcrm_live_abc123..." \
  http://localhost:3001/api/v1/clients
```

## 📋 Formato de Resposta

### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "pagination": {  // apenas em listagens
    "page": 1,
    "limit": 50,
    "total": 150,
    "total_pages": 3
  }
}
```

### Erro
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      {
        "field": "email",
        "message": "Email inválido"
      }
    ]
  }
}
```

## 🚦 Status HTTP

- `200` - Sucesso
- `201` - Criado
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Não encontrado
- `429` - Rate limit excedido
- `500` - Erro do servidor

## 🔑 Rate Limiting

- **Global:** 100 requisições por minuto
- **Headers de resposta:**
  - `RateLimit-Limit` - Limite total
  - `RateLimit-Remaining` - Requisições restantes
  - `RateLimit-Reset` - Timestamp de reset

---

## 📦 Endpoints

### 1. Health Check

#### `GET /health`

Health check do servidor (sem autenticação).

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2025-01-15T10:00:00Z",
    "version": "1.0.0"
  }
}
```

---

## 🔑 API Keys

### `POST /api-keys`

Criar nova API key.

**Body:**
```json
{
  "name": "n8n Production",
  "scopes": ["read", "write", "delete"],
  "expires_at": "2025-12-31T23:59:59Z"  // opcional
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "n8n Production",
    "key": "jcrm_live_abc123...",  // ⚠️ Mostrado apenas UMA vez
    "key_prefix": "jcrm_liv",
    "scopes": ["read", "write", "delete"],
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

### `GET /api-keys`

Listar API keys do usuário.

### `GET /api-keys/:id`

Buscar API key específica.

### `PATCH /api-keys/:id`

Atualizar API key.

### `DELETE /api-keys/:id`

Revogar API key.

---

## 👥 Clientes

### `GET /clients`

Listar todos os clientes.

**Query Params:**
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `status` (active|inactive|archived)
- `sort` (name|created_at, default: name)
- `order` (asc|desc, default: asc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "João Silva",
      "email": "joao@email.com",
      "phone": "(11) 98765-4321",
      "birth_date": "1990-05-15",
      "cpf": "123.456.789-00",
      "address": "Rua ABC, 123",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567",
      "emergency_contact": "Maria Silva",
      "emergency_phone": "(11) 98765-1234",
      "notes": "Paciente ansioso",
      "status": "active",
      "created_at": "2025-01-01T10:00:00Z",
      "updated_at": "2025-01-15T14:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `GET /clients/search?q=query`

Buscar clientes por nome, email ou telefone.

**Query Params:**
- `q` (string, obrigatório) - Termo de busca
- `page` (number)
- `limit` (number)

### `GET /clients/:id`

Buscar cliente específico.

### `POST /clients`

Criar novo cliente.

**Body:**
```json
{
  "name": "João Silva",  // obrigatório
  "email": "joao@email.com",
  "phone": "(11) 98765-4321",  // obrigatório
  "birth_date": "1990-05-15",
  "cpf": "123.456.789-00",
  "address": "Rua ABC, 123",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234-567",
  "emergency_contact": "Maria Silva",
  "emergency_phone": "(11) 98765-1234",
  "notes": "Observações sobre o paciente",
  "status": "active"  // active|inactive|archived
}
```

### `PUT /clients/:id`

Atualizar cliente (todos os campos).

### `PATCH /clients/:id`

Atualizar cliente (parcial).

**Body:**
```json
{
  "phone": "(11) 99999-9999",
  "status": "inactive"
}
```

### `DELETE /clients/:id`

Deletar cliente permanentemente.

### `GET /clients/stats`

Estatísticas de clientes.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "inactive": 20,
    "archived": 10
  }
}
```

---

## 📅 Agendamentos

### `GET /appointments`

Listar agendamentos.

**Query Params:**
- `page`, `limit`
- `client_id` (uuid) - Filtrar por cliente
- `status` (scheduled|confirmed|in_progress|completed|cancelled|no_show)
- `is_paid` (true|false)
- `date_from` (YYYY-MM-DD)
- `date_to` (YYYY-MM-DD)
- `sort` (date|created_at, default: date)
- `order` (asc|desc, default: asc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "client": {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@email.com",
        "phone": "(11) 98765-4321"
      },
      "date": "2025-01-20T14:00:00Z",
      "duration": 60,
      "type": "individual_therapy",
      "status": "scheduled",
      "notes": "Primeira consulta",
      "session_notes": null,
      "price": 150.00,
      "is_paid": false,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

**Tipos de sessão:**
- `individual_therapy` - Terapia individual
- `coaching` - Coaching
- `couples_therapy` - Terapia de casal
- `group_session` - Sessão em grupo
- `first_consultation` - Primeira consulta
- `follow_up` - Retorno

**Status:**
- `scheduled` - Agendado
- `confirmed` - Confirmado
- `in_progress` - Em andamento
- `completed` - Concluído
- `cancelled` - Cancelado
- `no_show` - Faltou

### `GET /appointments/upcoming?limit=10`

Próximos agendamentos.

### `GET /appointments/:id`

Buscar agendamento específico.

### `POST /appointments`

Criar agendamento.

**Body:**
```json
{
  "client_id": "uuid",  // obrigatório
  "date": "2025-01-20T14:00:00Z",  // obrigatório
  "duration": 60,
  "type": "individual_therapy",  // obrigatório
  "status": "scheduled",
  "notes": "Observações",
  "price": 150.00,  // obrigatório
  "is_paid": false
}
```

### `PUT /appointments/:id`

Atualizar agendamento completo.

### `PATCH /appointments/:id`

Atualizar agendamento parcial.

### `PATCH /appointments/:id/status`

Atualizar apenas status.

**Body:**
```json
{
  "status": "completed",
  "session_notes": "Sessão produtiva"
}
```

### `PATCH /appointments/:id/payment`

Marcar como pago/não pago.

**Body:**
```json
{
  "is_paid": true
}
```

### `DELETE /appointments/:id`

Deletar agendamento.

### `GET /appointments/stats`

Estatísticas de agendamentos.

---

## 💰 Transações

### `GET /transactions`

Listar transações.

**Query Params:**
- `page`, `limit`
- `type` (income|expense)
- `category` (session|package|product|rent|utilities|marketing|software|equipment|other)
- `status` (pending|paid|overdue|cancelled)
- `payment_method` (cash|pix|credit_card|debit_card|bank_transfer|health_insurance)
- `client_id` (uuid)
- `date_from` (YYYY-MM-DD)
- `date_to` (YYYY-MM-DD)
- `sort` (date|amount, default: date)
- `order` (asc|desc, default: desc)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "appointment_id": "uuid",
      "client": {
        "id": "uuid",
        "name": "João Silva"
      },
      "type": "income",
      "category": "session",
      "description": "Sessão de terapia individual",
      "amount": 150.00,
      "date": "2025-01-20T14:00:00Z",
      "payment_method": "pix",
      "status": "paid",
      "due_date": null,
      "paid_at": "2025-01-20T15:30:00Z",
      "created_at": "2025-01-20T14:00:00Z"
    }
  ],
  "pagination": { ... }
}
```

### `GET /transactions/pending`

Transações pendentes.

### `GET /transactions/overdue`

Transações vencidas.

### `GET /transactions/:id`

Buscar transação específica.

### `POST /transactions`

Criar transação.

**Body:**
```json
{
  "type": "income",  // obrigatório: income|expense
  "category": "session",  // obrigatório
  "description": "Sessão de terapia",  // obrigatório
  "amount": 150.00,  // obrigatório
  "date": "2025-01-20T14:00:00Z",  // obrigatório
  "payment_method": "pix",
  "status": "paid",
  "client_id": "uuid",
  "appointment_id": "uuid",
  "due_date": "2025-01-25T23:59:59Z",
  "paid_at": "2025-01-20T15:30:00Z"
}
```

### `PUT /transactions/:id`

Atualizar transação completa.

### `PATCH /transactions/:id`

Atualizar transação parcial.

### `PATCH /transactions/:id/status`

Atualizar status.

**Body:**
```json
{
  "status": "paid"
}
```

### `PATCH /transactions/:id/pay`

Marcar como pago.

**Body:**
```json
{
  "payment_method": "pix",
  "paid_at": "2025-01-20T15:30:00Z"  // opcional
}
```

### `DELETE /transactions/:id`

Deletar transação.

### `GET /transactions/dashboard`

Dashboard financeiro.

**Query Params:**
- `date_from` (YYYY-MM-DD) - opcional
- `date_to` (YYYY-MM-DD) - opcional

**Response:**
```json
{
  "success": true,
  "data": {
    "total_income": 15000.00,
    "total_expenses": 3000.00,
    "balance": 12000.00,
    "paid_income": 12000.00,
    "pending_income": 2000.00,
    "overdue_income": 1000.00,
    "income_by_category": {
      "session": 12000.00,
      "package": 3000.00
    },
    "expenses_by_category": {
      "rent": 2000.00,
      "utilities": 500.00,
      "software": 500.00
    },
    "transactions_count": 150
  }
}
```

### `GET /transactions/reports/monthly`

Relatório mensal.

**Query Params:**
- `year` (number, obrigatório) - ex: 2025
- `month` (number, obrigatório) - 1-12

---

## 📊 Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `VALIDATION_ERROR` | Dados inválidos no body |
| `INVALID_API_KEY` | API key inválida ou expirada |
| `MISSING_API_KEY` | Header X-API-Key não fornecido |
| `INSUFFICIENT_PERMISSIONS` | Scope insuficiente |
| `NOT_FOUND` | Recurso não encontrado |
| `DUPLICATE_ENTRY` | Registro duplicado |
| `RATE_LIMIT_EXCEEDED` | Limite de requests excedido |
| `INTERNAL_ERROR` | Erro interno do servidor |

---

## 🔒 Scopes e Permissões

API keys podem ter 3 tipos de permissões:

- **`read`** - GET (listar, buscar)
- **`write`** - POST, PUT, PATCH (criar, atualizar)
- **`delete`** - DELETE (deletar)

**Exemplo:**
```json
{
  "scopes": ["read", "write"]  // Sem permissão de delete
}
```

---

## 💡 Dicas

### Paginação
- Use `limit` para controlar resultados por página
- Máximo de 100 resultados por página
- Use `page` para navegar

### Filtros
- Combine múltiplos filtros para queries precisas
- Use `date_from` e `date_to` para ranges
- Status filters ajudam a segmentar dados

### Performance
- Filtre no servidor em vez do cliente
- Use paginação sempre que possível
- Cache respostas quando apropriado

### Datas
- Formato ISO 8601: `2025-01-20T14:00:00Z`
- Dates: `YYYY-MM-DD`
- DateTimes: `YYYY-MM-DDTHH:mm:ssZ`

---

**Juvenal CRM API v1.0.0**
