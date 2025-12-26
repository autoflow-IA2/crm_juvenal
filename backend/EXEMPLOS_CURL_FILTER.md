# Exemplos de cURL - API de Filtro de Clientes

## Configuração

**Endpoint:** `GET /api/clientes/filter`
**Autenticação:** API Key via header `X-API-Key`
**Base URL:** `http://localhost:3001` (desenvolvimento) ou sua URL de produção

---

## 1. Buscar por Nome Exato

```bash
curl -X GET "http://localhost:3001/api/clientes/filter?name=João%20Silva" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

---

## 2. Buscar por Telefone Exato

```bash
curl -X GET "http://localhost:3001/api/clientes/filter?phone=11999999999" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

---

## 3. Buscar por Nome OU Telefone (Lógica OR)

Se passar ambos, retorna clientes que atendem **qualquer um** dos critérios:

```bash
curl -X GET "http://localhost:3001/api/clientes/filter?name=João%20Silva&phone=11999999999" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

---

## 4. Buscar com Filtro de Status

```bash
curl -X GET "http://localhost:3001/api/clientes/filter?phone=11999999999&status=active" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

**Status válidos:**
- `active` - Cliente ativo
- `inactive` - Cliente inativo
- `archived` - Cliente arquivado

---

## 5. Buscar Apenas Clientes Ativos

```bash
curl -X GET "http://localhost:3001/api/clientes/filter?status=active" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

---

## 6. Listar Todos os Clientes (Sem Filtros)

```bash
curl -X GET "http://localhost:3001/api/clientes/filter" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sua-chave-api-super-secreta-aqui"
```

---

## Exemplo de Resposta de Sucesso

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "email": "joao@email.com",
      "telefone": "11999999999",
      "data_nascimento": "1990-01-15",
      "cpf": "123.456.789-00",
      "endereco": "Rua Exemplo, 123",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "contato_emergencia": "Maria Silva",
      "telefone_emergencia": "11988888888",
      "status": "active",
      "observacoes": "Cliente desde 2023",
      "criado_em": "2024-01-01T00:00:00.000Z",
      "atualizado_em": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "1 cliente(s) encontrado(s)"
}
```

---

## Exemplo de Resposta Vazia

```json
{
  "success": true,
  "data": [],
  "message": "Nenhum cliente encontrado"
}
```

---

## Exemplo de Erro (401 - Não Autenticado)

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "API Key não fornecida"
  }
}
```

---

## Exemplo de Erro (403 - API Key Inválida)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "API Key inválida"
  }
}
```

---

## Exemplo de Erro (400 - Validação)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Erro de validação",
    "details": {
      "status": "Status inválido. Valores aceitos: active, inactive, archived"
    }
  }
}
```

---

## Testando no Windows (Arquivo .bat)

Crie um arquivo `test_client_filter.bat`:

```batch
@echo off
echo ============================================
echo Testando API de Filtro de Clientes
echo ============================================

set API_KEY=sua-chave-api-super-secreta-aqui
set BASE_URL=http://localhost:3001

echo.
echo [1] Buscar por telefone:
curl -X GET "%BASE_URL%/api/clientes/filter?phone=11999999999" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo [2] Buscar por nome:
curl -X GET "%BASE_URL%/api/clientes/filter?name=João Silva" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo [3] Buscar por nome OU telefone:
curl -X GET "%BASE_URL%/api/clientes/filter?name=João Silva&phone=11999999999" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo [4] Buscar por telefone + status ativo:
curl -X GET "%BASE_URL%/api/clientes/filter?phone=11999999999&status=active" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo [5] Listar apenas clientes ativos:
curl -X GET "%BASE_URL%/api/clientes/filter?status=active" ^
  -H "Content-Type: application/json" ^
  -H "X-API-Key: %API_KEY%"

echo.
echo.
echo ============================================
pause
```

**Como usar:**
1. Salve como `test_client_filter.bat`
2. Edite o valor de `API_KEY` com sua chave real
3. Execute o arquivo `.bat`

---

## Usando no N8N (HTTP Request Node)

### Configuração do Node

**Method:** GET
**URL:** `http://seu-backend.com/api/clientes/filter`
**Authentication:** Generic Credential Type → Header Auth

**Headers:**
- Name: `X-API-Key`
- Value: `sua-chave-api-aqui`

**Query Parameters:**

| Parameter | Expression | Example |
|-----------|-----------|---------|
| `name` | `{{ $json.nome_cliente }}` | João Silva |
| `phone` | `{{ $json.telefone }}` | 11999999999 |
| `status` | `active` | active |

### Exemplo de Workflow N8N

```
[Webhook]
   ↓
[Set Variables] (define nome ou telefone)
   ↓
[HTTP Request] (/api/clientes/filter)
   ↓
[IF] (verifica se encontrou clientes)
   ↓
[Responde com dados do cliente]
```

---

## Observações Importantes

### Diferença entre `/search` e `/filter`

| Endpoint | Tipo de Busca | Uso Recomendado |
|----------|---------------|-----------------|
| `/api/clientes/search?q=termo` | Busca parcial (LIKE %termo%) em nome, email e telefone | UI, busca por termo genérico |
| `/api/clientes/filter?name=X&phone=Y` | Busca exata (=) em nome OU telefone | Integrações, N8N, webhooks |

### Busca Exata vs Parcial

- **`/filter`**: Busca EXATA → `name=João Silva` só retorna se o nome for exatamente "João Silva"
- **`/search`**: Busca PARCIAL → `q=João` retorna "João Silva", "Maria João", etc.

### Lógica OR vs AND

- **Nome OU Telefone (OR)**: `filter?name=João&phone=11999` → retorna clientes com nome "João" OU telefone "11999"
- **Filtro de Status (AND)**: `filter?phone=11999&status=active` → retorna clientes com telefone "11999" E status "active"

### Encoding de URL

Lembre-se de fazer URL encoding para espaços e caracteres especiais:
- Espaço → `%20`
- Exemplo: `João Silva` → `João%20Silva`

No cURL, você pode usar aspas simples ou duplas e o encoding será automático em alguns casos, mas é mais seguro fazer manualmente.

---

## Variáveis de Ambiente

Certifique-se de que seu arquivo `.env` no backend possui:

```env
PORT=3001
API_KEY=sua-chave-api-super-secreta-aqui
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_KEY=sua-service-role-key
```

---

## Testando a API

1. **Inicie o backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Execute os testes:**
   - Use os comandos cURL acima
   - Ou execute o arquivo `.bat`
   - Ou use ferramentas como Postman, Insomnia, ou Thunder Client (VSCode)

---

## Troubleshooting

### Erro: "Cannot GET /api/clientes/filter"
- ✅ Verifique se o backend está rodando
- ✅ Confirme que a porta está correta (3001)
- ✅ Verifique se a rota foi adicionada corretamente

### Erro: "API Key inválida"
- ✅ Verifique se o header `X-API-Key` está sendo enviado
- ✅ Confirme que o valor corresponde ao `API_KEY` no `.env`

### Nenhum resultado retornado
- ✅ Verifique se os valores são EXATOS (não parciais)
- ✅ Confirme que o cliente existe no banco de dados
- ✅ Teste sem filtros para ver todos os clientes: `GET /api/clientes/filter`
