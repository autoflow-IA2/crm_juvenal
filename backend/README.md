# Juvenal CRM API

API REST para integração com ferramentas externas do Juvenal CRM - Sistema de gerenciamento de clínicas de terapia/coaching.

## Início Rápido

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Supabase com projeto configurado
- npm ou yarn

### Instalação

```bash
# 1. Navegar até a pasta do backend
cd backend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais

# 4. Iniciar servidor em modo desenvolvimento
npm run dev

# 5. Ou fazer build e rodar em produção
npm run build
npm start
```

### Configuração do .env

```env
# Configuração do Servidor
PORT=3001
NODE_ENV=development

# API Key para autenticação
# Gere uma chave segura usando: openssl rand -base64 32
API_KEY=sua-chave-api-super-secreta-aqui

# Configuração do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key

# CORS - Origens permitidas (separadas por vírgula)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Documentação da API

### Autenticação

Todas as rotas `/api/*` requerem autenticação via API Key.

**Header obrigatório:**
```
X-API-Key: sua-chave-api-aqui
```

### Formato de Resposta

#### Sucesso
```json
{
  "success": true,
  "data": { ... },
  "message": "Mensagem de sucesso"
}
```

#### Erro
```json
{
  "success": false,
  "error": {
    "code": "CODIGO_ERRO",
    "message": "Mensagem de erro",
    "details": { ... }
  }
}
```

## Endpoints

### 1. Health Check

**GET** `/api/health`

Verifica se a API está funcionando.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-12-09T10:30:00.000Z",
    "uptime": 12345,
    "environment": "development"
  }
}
```

---

### 2. Listar Agendamentos

**GET** `/api/agendamentos`

Lista agendamentos com filtros opcionais.

**Query Parameters:**
- `date` - Filtrar por data específica (YYYY-MM-DD)
- `dateStart` - Data inicial do período (YYYY-MM-DD)
- `dateEnd` - Data final do período (YYYY-MM-DD)
- `status` - Filtrar por status (agendado, confirmado, em_andamento, concluido, cancelado, nao_compareceu)
- `paymentStatus` - Filtrar por status de pagamento (pendente, pago, parcial, cancelado, reembolsado)
- `sessionType` - Filtrar por tipo de sessão
- `clientId` - Filtrar por cliente (UUID)
- `clientName` - Buscar por nome do cliente (parcial)

**Exemplo:**
```bash
GET /api/agendamentos?dateStart=2025-12-01&dateEnd=2025-12-31&status=confirmado
```

---

### 3. Agendamentos de Hoje

**GET** `/api/agendamentos/hoje`

Retorna todos os agendamentos do dia atual.

---

### 4. Próximos Agendamentos

**GET** `/api/agendamentos/proximos`

Retorna os próximos agendamentos (futuros).

**Query Parameters:**
- `limit` - Quantidade máxima de resultados (padrão: 10)

---

### 5. Estatísticas

**GET** `/api/agendamentos/stats`

Retorna estatísticas de agendamentos.

**Resposta:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "hoje": 5,
    "semana": 25,
    "mes": 80,
    "porStatus": {
      "agendado": 30,
      "confirmado": 45,
      "em_andamento": 2,
      "concluido": 60,
      "cancelado": 10,
      "nao_compareceu": 3
    },
    "porTipo": {
      "sessao_individual": 100,
      "sessao_casal": 20,
      "sessao_familia": 10,
      "sessao_grupo": 5,
      "primeira_consulta": 10,
      "retorno": 5
    },
    "receitaMes": 15000.00,
    "receitaPendente": 3500.00
  }
}
```

---

### 6. Buscar Agendamento por ID

**GET** `/api/agendamentos/:id`

Retorna detalhes de um agendamento específico.

---

### 7. Criar Agendamento

**POST** `/api/agendamentos`

Cria um novo agendamento. Verifica automaticamente conflitos de horário.

**Body (JSON):**
```json
{
  "client_id": "uuid-do-cliente",
  "session_type": "sessao_individual",
  "date": "2025-12-25",
  "start_time": "14:00",
  "end_time": "15:00",
  "duration": 60,
  "price": 200.00,
  "payment_status": "pendente",
  "payment_method": "pix",
  "status": "agendado",
  "notes": "Cliente prefere sala 2",
  "private_notes": "Acompanhamento ansiedade"
}
```

**Tipos de Sessão:**
- `sessao_individual`
- `sessao_casal`
- `sessao_familia`
- `sessao_grupo`
- `primeira_consulta`
- `retorno`

**Status de Agendamento:**
- `agendado`
- `confirmado`
- `em_andamento`
- `concluido`
- `cancelado`
- `nao_compareceu`

**Status de Pagamento:**
- `pendente`
- `pago`
- `parcial`
- `cancelado`
- `reembolsado`

**Métodos de Pagamento:**
- `dinheiro`
- `pix`
- `cartao_credito`
- `cartao_debito`
- `transferencia`
- `boleto`

---

### 8. Atualizar Agendamento

**PATCH** `/api/agendamentos/:id`

Atualiza um agendamento existente (campos parciais).

---

### 9. Atualizar Status

**PATCH** `/api/agendamentos/:id/status`

Atualiza apenas o status do agendamento.

**Body:**
```json
{
  "status": "confirmado"
}
```

---

### 10. Atualizar Pagamento

**PATCH** `/api/agendamentos/:id/payment`

Atualiza status de pagamento.

**Body:**
```json
{
  "payment_status": "pago",
  "payment_method": "pix"
}
```

---

### 11. Deletar Agendamento

**DELETE** `/api/agendamentos/:id`

Remove um agendamento.

---

### 12. Verificar Disponibilidade

**POST** `/api/agendamentos/verificar-disponibilidade`

Verifica se há conflitos de horário sem criar o agendamento.

**Body:**
```json
{
  "date": "2025-12-25",
  "startTime": "14:00",
  "endTime": "15:00",
  "excludeId": "id-para-excluir-da-verificacao"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "disponivel": false,
    "conflitos": [
      {
        "id": "conflito-id",
        "client_name": "João Silva",
        "date": "2025-12-25",
        "start_time": "14:00",
        "end_time": "15:00",
        "session_type": "sessao_individual"
      }
    ]
  }
}
```

---

### 13. Finalizar Agendamentos Passados

**POST** `/api/agendamentos/finalizar-passados`

Finaliza automaticamente agendamentos que já passaram (para uso com cron jobs).

**Resposta:**
```json
{
  "success": true,
  "data": {
    "finalizados": 5,
    "ids": ["id1", "id2", "id3", "id4", "id5"]
  }
}
```

---

## Segurança

- ✅ API Key obrigatória em todas as requisições `/api/*`
- ✅ CORS configurável
- ✅ Helmet.js para headers de segurança
- ✅ Validação de entrada com Zod
- ✅ Service Role Key do Supabase (bypass RLS)
- ✅ Tratamento consistente de erros

---

## Testando a API

### Com cURL

```bash
# Health check
curl -H "X-API-Key: sua-api-key" http://localhost:3001/api/health

# Listar agendamentos
curl -H "X-API-Key: sua-api-key" http://localhost:3001/api/agendamentos

# Criar agendamento
curl -X POST \
  -H "X-API-Key: sua-api-key" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"uuid","session_type":"sessao_individual","date":"2025-12-25","start_time":"14:00","end_time":"15:00","duration":60}' \
  http://localhost:3001/api/agendamentos
```

---

## Códigos de Erro

| Código | Descrição |
|--------|-----------|
| `UNAUTHORIZED` | API Key não fornecida |
| `FORBIDDEN` | API Key inválida |
| `NOT_FOUND` | Recurso não encontrado |
| `VALIDATION_ERROR` | Dados inválidos |
| `CONFLICT` | Conflito de dados |
| `DATABASE_ERROR` | Erro no banco de dados |
| `INTERNAL_ERROR` | Erro interno do servidor |

---

## Scripts Disponíveis

```bash
npm run dev        # Inicia servidor em modo desenvolvimento (hot reload)
npm run build      # Compila TypeScript para JavaScript
npm start          # Inicia servidor em produção
npm run type-check # Verifica tipos sem compilar
npm run clean      # Remove pasta dist
```

---

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.config.ts
│   ├── controllers/
│   │   └── agendamentos.controller.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── agendamentos.routes.ts
│   ├── services/
│   │   └── agendamentos.service.ts
│   ├── types/
│   │   ├── agendamento.types.ts
│   │   └── validation.schemas.ts
│   ├── utils/
│   │   └── response.utils.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

**Versão:** 1.0.0
**Última atualização:** Dezembro 2025
