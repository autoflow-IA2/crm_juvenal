# Resultados dos Testes da API

## ✅ Testes Bem-Sucedidos

### 1. Health Check
```bash
curl -X GET "http://localhost:3001/api/health" \
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
```
**Resultado:** ✅ **SUCCESS**
```json
{
  "success": true,
  "data": {
    "status": "OK",
    "timestamp": "2025-12-10T21:50:38.222Z",
    "uptime": 1107.589167,
    "environment": "development"
  },
  "message": "API está funcionando corretamente"
}
```

### 2. GET /api/agendamentos (Listar)
```bash
curl -X GET "http://localhost:3001/api/agendamentos" \
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
```
**Resultado:** ✅ **SUCCESS**
- Lista agendamentos com sucesso
- Inclui JOIN com tabela `clients` (full_name, email, phone)
- Todos os campos migrados aparecendo corretamente (start_time, end_time, payment_status, etc)

### 3. GET /api/agendamentos/stats (Estatísticas)
```bash
curl -X GET "http://localhost:3001/api/agendamentos/stats" \
  -H "X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM="
```
**Resultado:** ✅ **SUCCESS**
```json
{
  "success": true,
  "data": {
    "total": 1,
    "hoje": 0,
    "semana": 0,
    "mes": 1,
    "porStatus": {
      "agendado": 0,
      "confirmado": 0,
      "em_andamento": 0,
      "concluido": 0,
      "cancelado": 0,
      "nao_compareceu": 0
    },
    "porTipo": {
      "sessao_individual": 0,
      "sessao_casal": 0,
      "sessao_familia": 0,
      "sessao_grupo": 0,
      "primeira_consulta": 0,
      "retorno": 0
    },
    "receitaMes": 0,
    "receitaPendente": 150
  },
  "message": "Estatísticas obtidas com sucesso"
}
```

## ❌ Testes com Problemas

### 4. POST /api/agendamentos (Criar)
**Problema:** Erro ao criar novos agendamentos via API

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Erro interno do servidor",
    "details": "invalid input value for enum appointment_status: \"cancelado\""
  }
}
```

**Causa Raiz:**
A migração 005 adicionou NOVAS colunas com enums em português (`appointment_status`, `payment_status`, `session_type`) mas manteve as colunas antigas (`status`, `is_paid`, `type`) com enums em inglês.

Quando tentamos inserir dados via API, há um conflito:
- A coluna antiga `status` usa o enum `appointment_status` (valores inglês: scheduled, confirmed, cancelled, etc)
- A coluna nova `appointment_status` usa o enum `appointment_status_pt` (valores português: agendado, confirmado, cancelado, etc)

O erro "invalid input value for enum appointment_status: 'cancelado'" sugere que o PostgreSQL está tentando inserir o valor português 'cancelado' na coluna `status` antiga que só aceita inglês.

**Workaround Testado:**
Criação direta via Supabase JS SDK funciona:
```javascript
const agendamento = {
  user_id: 'fed78b62-6cde-4190-a2a1-b96cdfaa996d',
  client_id: '7447fb84-26f0-4f65-9765-0e7fcb411400',
  date: '2025-12-15 14:00:00+00',
  start_time: '14:00:00',
  duration: 60,
  type: 'individual_therapy',
  status: 'scheduled',
  price: 150.00,
  is_paid: false,
  notes: 'Teste via API'
};
// ✅ Funciona!
```

### 5. POST /api/agendamentos/verificar-disponibilidade
**Problema:** Mesmo erro de enum
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Erro interno do servidor",
    "details": "invalid input value for enum appointment_status: \"cancelado\""
  }
}
```

## 🔧 Correções Aplicadas

1. ✅ Renomeado `clients.name` → `clients.full_name` em todos os SELECTs do service
2. ✅ Tornado `end_time` opcional no schema de validação (calculado por trigger)
3. ✅ Adicionado `user_id` ao schema de validação
4. ✅ Adicionados campos de compatibilidade (`type`, `status`, `is_paid`) ao schema
5. ✅ Removidos `.default()` do Zod para deixar banco aplicar defaults

## 📊 Resumo

| Endpoint | Método | Status | Observação |
|----------|--------|--------|------------|
| /api/health | GET | ✅ OK | Funcionando |
| /api/agendamentos | GET | ✅ OK | Listagem funciona perfeitamente |
| /api/agendamentos/stats | GET | ✅ OK | Estatísticas funcionam |
| /api/agendamentos | POST | ❌ ERRO | Conflito de enums (português vs inglês) |
| /api/agendamentos/verificar-disponibilidade | POST | ❌ ERRO | Mesmo problema de enum |

## 🚀 Próximos Passos Recomendados

### Opção A: Usar Apenas Campos Antigos (Mais Rápido)
Remover as novas colunas portuguesas e usar apenas as antigas em inglês:
- Usar `status` ao invés de `appointment_status`
- Usar `type` ao invés de `session_type`
- Usar `is_paid` ao invés de `payment_status`

### Opção B: Migrar Completamente para Português (Recomendado para Longo Prazo)
1. Dropar as colunas antigas (`status`, `type`, `is_paid`)
2. Renomear constraints
3. Atualizar todos os triggers
4. Garantir que apenas os enums portugueses existem

### Opção C: Manter Ambos e Sincronizar
Criar triggers para manter ambas as colunas sincronizadas:
- Quando `status` muda, atualizar `appointment_status` automaticamente
- Quando `appointment_status` muda, atualizar `status` automaticamente

## 🎯 Funcionalidades Confirmadas

Apesar do problema com POST, a migração foi parcialmente bem-sucedida:

✅ Tabela `clients` agora tem `full_name`
✅ Tabela `appointments` tem as novas colunas: `start_time`, `end_time`, `payment_status`, `payment_method`, `session_type`, `appointment_status`
✅ Triggers funcionam (end_time é calculado automaticamente, client_name é sincronizado)
✅ Índices criados para performance
✅ GET requests funcionam perfeitamente
✅ Agendamentos criados via SDK direto funcionam

❌ POST via API tem conflito de enums que precisa ser resolvido

## 📝 Nota Importante

O agendamento criado via SDK direto aparece corretamente no GET:
```json
{
  "id": "903b42a1-ba65-4211-adf7-7a4251f14797",
  "user_id": "fed78b62-6cde-4190-a2a1-b96cdfaa996d",
  "client_id": "7447fb84-26f0-4f65-9765-0e7fcb411400",
  "date": "2025-12-15T14:00:00+00:00",
  "start_time": "14:00:00",
  "end_time": "15:00:00",
  "payment_status": "pendente",
  "appointment_status": "agendado",
  "session_type": null,
  "client_name": "Carlos Mendes",
  "client_phone": "(11) 95555-5555",
  "client_email": "carlos@test.com"
}
```

Isso confirma que a estrutura do banco está correta, o problema é apenas no fluxo de POST via API.
