# Incompatibilidade de Schema

## Problema
A API foi desenvolvida assumindo um schema diferente do que existe no banco de dados Supabase.

## Schema Atual do Banco (Supabase)

### Tabela `appointments`:
```sql
- id: uuid
- user_id: uuid
- client_id: uuid
- date: timestamptz (data + hora do agendamento)
- duration: integer (duração em minutos)
- type: session_type enum
- status: appointment_status enum
- notes: text
- session_notes: text
- price: decimal(10,2)
- is_paid: boolean
- created_at: timestamptz
- updated_at: timestamptz
```

### Tabela `clients`:
```sql
- id: uuid
- user_id: uuid
- name: text (não full_name!)
- email: text
- phone: text
- ...
```

## Schema Esperado pela API

A API espera:
- `session_type` (mas o banco tem `type`)
- `start_time` e `end_time` (mas o banco tem apenas `date` + `duration`)
- `payment_status` e `payment_method` (mas o banco tem apenas `is_paid`)
- `client.full_name` (mas o banco tem `client.name`)

## Solução

Opção 1: Criar migration para adicionar colunas
Opção 2: Adaptar a API para usar o schema existente (RECOMENDADO)

Preciso reescrever toda a API para funcionar com o schema existente.
