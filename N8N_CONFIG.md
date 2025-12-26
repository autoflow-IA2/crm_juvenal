# Configuração da API no n8n

## 🔑 Credenciais

**API Key:** `vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=`

**Base URL:** `https://crm-programando-pensamentos.si2cu4.easypanel.host`

---

## 📋 Endpoints Disponíveis

### 1. Buscar Clientes por Nome/Email/Telefone

**Endpoint:** `GET /api/clientes/search`

**Query Parameters:**
- `q` (string, obrigatório) - Termo de busca

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/search?q=maria
```

**Headers obrigatórios:**
```
X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=
Content-Type: application/json
```

---

### 2. Listar Todos os Clientes

**Endpoint:** `GET /api/clientes`

**Query Parameters (todos opcionais):**
- `status` (string) - Filtrar por status: "active", "inactive", "archived"
- `search` (string) - Termo de busca
- `city` (string) - Filtrar por cidade
- `state` (string) - Filtrar por estado

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes?status=active
```

---

### 3. Listar Apenas Clientes Ativos

**Endpoint:** `GET /api/clientes/ativos`

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/ativos
```

---

### 4. Buscar Cliente por ID

**Endpoint:** `GET /api/clientes/:id`

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/123e4567-e89b-12d3-a456-426614174000
```

---

### 5. Estatísticas de Clientes

**Endpoint:** `GET /api/clientes/stats`

**Retorna:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "active": 40,
    "inactive": 8,
    "archived": 2
  }
}
```

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/stats
```

---

### 6. Criar Novo Cliente

**Endpoint:** `POST /api/clientes`

**Body (JSON):**
```json
{
  "name": "Maria Silva",
  "email": "maria@exemplo.com",
  "phone": "11999999999",
  "cpf": "12345678900",
  "birth_date": "1990-05-15",
  "gender": "feminino",
  "address": "Rua Exemplo, 123",
  "neighborhood": "Centro",
  "city": "São Paulo",
  "state": "SP",
  "zip_code": "01234567",
  "status": "active",
  "emergency_contact_name": "João Silva",
  "emergency_contact_phone": "11988888888",
  "notes": "Cliente preferencial"
}
```

**Campos obrigatórios:**
- `name` (string)
- `phone` (string)
- `status` (string: "active", "inactive", "archived")

---

### 7. Atualizar Cliente

**Endpoint:** `PATCH /api/clientes/:id`

**Body (JSON) - enviar apenas campos a serem atualizados:**
```json
{
  "name": "Maria Santos",
  "email": "maria.santos@exemplo.com",
  "status": "inactive"
}
```

---

### 8. Deletar Cliente

**Endpoint:** `DELETE /api/clientes/:id`

**Exemplo de URL completa:**
```
https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/123e4567-e89b-12d3-a456-426614174000
```

---

## 🛠️ Configuração no n8n - Passo a Passo

### Método 1: HTTP Request Node (Recomendado)

1. **Adicione um nó "HTTP Request"**

2. **Configure os campos básicos:**
   - **Authentication:** None (vamos usar header customizado)
   - **Method:** `GET`
   - **URL:** Cole a URL completa, exemplo:
     ```
     https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/search?q=maria
     ```

3. **Configure os Headers:**
   - Clique em "Add Header"
   - **Name:** `X-API-Key`
   - **Value:** `vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=`

   - Clique em "Add Header" novamente
   - **Name:** `Content-Type`
   - **Value:** `application/json`

4. **Configurações Opcionais:**
   - **Timeout:** 10000 (10 segundos)
   - **Response Format:** JSON

5. **Execute o nó** e verifique a resposta

---

### Método 2: Usando Credentials (Mais Seguro)

1. **Crie uma credencial personalizada:**
   - Vá em **Credentials** → **Add Credential**
   - Selecione **Header Auth**
   - **Name:** `CRM API Key`
   - **Header Name:** `X-API-Key`
   - **Header Value:** `vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=`
   - Salve

2. **Configure o HTTP Request Node:**
   - **Authentication:** Header Auth
   - **Credential for Header Auth:** Selecione `CRM API Key`
   - **Method:** `GET`
   - **URL:** `https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/search?q=maria`

---

## 🧪 Testando a Configuração

Execute o arquivo `test_production_api.bat` na raiz do projeto para testar todos os endpoints.

---

## 📊 Formato de Resposta Padrão

### Sucesso:
```json
{
  "success": true,
  "data": [...],
  "message": "Mensagem de sucesso"
}
```

### Erro:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro"
  }
}
```

---

## ⚠️ Códigos de Erro Comuns

| Código | Significado | Solução |
|--------|-------------|---------|
| **401** | API Key não fornecida | Adicione o header `X-API-Key` |
| **403** | API Key inválida | Verifique se a API Key está correta |
| **404** | Endpoint não encontrado | Verifique a URL |
| **500** | Erro no servidor | Verifique os logs do servidor |
| **Timeout** | Servidor não responde | Verifique se o servidor está online |

---

## 📝 Exemplo Completo de Workflow no n8n

```
1. [Schedule Trigger] - A cada 5 minutos
   ↓
2. [HTTP Request] - Buscar clientes ativos
   - URL: https://crm-programando-pensamentos.si2cu4.easypanel.host/api/clientes/ativos
   - Header: X-API-Key: vtmGTnqVqeL+dYSzyrNvcWtRxwgUxIe5Tn+gEWNKJyM=
   ↓
3. [IF] - Verificar se há clientes
   ↓
4. [Set] - Processar dados
   ↓
5. [Email/Webhook/etc] - Enviar notificação
```

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- Nunca compartilhe sua API Key publicamente
- Use sempre HTTPS (já configurado na URL de produção)
- A API Key atual é válida apenas para este ambiente

---

## 📞 Suporte

Se continuar tendo problemas:

1. Execute `test_production_api.bat` e copie o resultado
2. Verifique os logs do servidor backend
3. Confirme que há clientes cadastrados no banco de dados
