# Juvenal CRM - Guia de Integração n8n

Guia completo para integrar o Juvenal CRM com n8n e criar automações poderosas.

## 📋 Pré-requisitos

1. Conta no Juvenal CRM
2. n8n instalado e rodando
3. API Key do Juvenal CRM

## 🔐 1. Obter API Key

### Passo a Passo

1. Faça login no Juvenal CRM
2. Acesse **Perfil > API Keys**
3. Clique em **"Gerar Nova API Key"**
4. Dê um nome (ex: "n8n Production")
5. Selecione permissões: `read`, `write`, `delete`
6. **⚠️ IMPORTANTE**: Copie a key imediatamente - ela é mostrada apenas uma vez!

### Formato da Key
```
jcrm_live_abc123def456ghij789klmnop...
```

## 🔧 2. Configurar n8n

### Método 1: HTTP Request Node (Recomendado)

1. Adicione um node **"HTTP Request"**
2. Configure:
   - **Method**: GET/POST/PUT/PATCH/DELETE
   - **URL**: `http://localhost:3001/api/v1/...`
   - **Authentication**: `Header Auth`
   - **Header Name**: `X-API-Key`
   - **Header Value**: `sua_api_key_aqui`

### Método 2: Credentials (Reutilizável)

1. Vá em **Settings > Credentials**
2. Crie uma nova credential tipo **"Header Auth"**
3. Configure:
   - **Name**: `X-API-Key`
   - **Value**: `sua_api_key_aqui`
4. Salve e use em todos os HTTP Request nodes

## 🚀 3. Workflows Comuns

### Workflow 1: Criar Cliente Automaticamente de Email

**Trigger**: Email recebido com novo lead

**Steps**:
1. **Email Trigger** - Monitora caixa de entrada
2. **Set** - Extrai dados do email (nome, email, telefone)
3. **HTTP Request** - Cria cliente no Juvenal CRM
   ```
   POST /api/v1/clients
   Body:
   {
     "name": "{{$node["Set"].json["name"]}}",
     "email": "{{$node["Set"].json["email"]}}",
     "phone": "{{$node["Set"].json["phone"]}}",
     "status": "active"
   }
   ```

### Workflow 2: Agendar Consulta Automaticamente

**Trigger**: Webhook recebendo dados de formulário

**Steps**:
1. **Webhook** - Recebe dados do formulário
2. **HTTP Request** - Busca cliente por email
   ```
   GET /api/v1/clients/search?q={{$json["email"]}}
   ```
3. **IF** - Verifica se cliente existe
4a. **HTTP Request** - Cria agendamento
   ```
   POST /api/v1/appointments
   Body:
   {
     "client_id": "{{$json["data"][0]["id"]}}",
     "date": "{{$json["date"]}}",
     "type": "first_consultation",
     "duration": 60,
     "price": 150.00,
     "status": "scheduled"
   }
   ```
4b. **HTTP Request** - Cria cliente se não existe

### Workflow 3: Registrar Pagamento Recebido

**Trigger**: Webhook do gateway de pagamento (Stripe, PagSeguro, etc.)

**Steps**:
1. **Webhook** - Recebe notificação de pagamento
2. **HTTP Request** - Cria transação
   ```
   POST /api/v1/transactions
   Body:
   {
     "type": "income",
     "category": "session",
     "description": "Pagamento sessão - {{$json["customer_name"]}}",
     "amount": {{$json["amount"]}},
     "date": "{{$json["payment_date"]}}",
     "payment_method": "pix",
     "status": "paid",
     "paid_at": "{{$json["payment_date"]}}"
   }
   ```

### Workflow 4: Lembretes de Consulta

**Trigger**: Cron - Roda diariamente às 8h

**Steps**:
1. **Cron** - Trigger diário
2. **HTTP Request** - Busca agendamentos do dia
   ```
   GET /api/v1/appointments/upcoming?limit=20
   ```
3. **Loop** - Para cada agendamento
4. **HTTP Request** - Busca dados completos do cliente
5. **Email/SMS** - Envia lembrete ao cliente

### Workflow 5: Relatório Mensal Automático

**Trigger**: Cron - Primeiro dia do mês às 9h

**Steps**:
1. **Cron** - Trigger mensal
2. **HTTP Request** - Busca relatório do mês anterior
   ```
   GET /api/v1/transactions/reports/monthly?year=2025&month=1
   ```
3. **Function** - Formata dados para email
4. **Email** - Envia relatório formatado

## 📡 4. Exemplos de Requisições

### Criar Cliente

```bash
curl -X POST http://localhost:3001/api/v1/clients \
  -H "X-API-Key: jcrm_live_abc123..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 98765-4321",
    "birth_date": "1990-05-15",
    "status": "active"
  }'
```

### Listar Clientes Ativos

```bash
curl -X GET "http://localhost:3001/api/v1/clients?status=active&page=1&limit=50" \
  -H "X-API-Key: jcrm_live_abc123..."
```

### Buscar Próximos Agendamentos

```bash
curl -X GET "http://localhost:3001/api/v1/appointments/upcoming?limit=10" \
  -H "X-API-Key: jcrm_live_abc123..."
```

### Dashboard Financeiro

```bash
curl -X GET "http://localhost:3001/api/v1/transactions/dashboard?date_from=2025-01-01&date_to=2025-01-31" \
  -H "X-API-Key: jcrm_live_abc123..."
```

## 🎯 5. Boas Práticas

### Segurança
- ✅ **Nunca** exponha sua API key em código público
- ✅ Use credentials reutilizáveis no n8n
- ✅ Crie keys separadas para desenvolvimento e produção
- ✅ Revogue keys antigas ou comprometidas

### Performance
- ✅ Use paginação para grandes volumes de dados
- ✅ Filtre resultados no servidor (query params) em vez do cliente
- ✅ Cache respostas quando possível
- ✅ Respeite os rate limits (100 req/min)

### Tratamento de Erros
- ✅ Sempre verifique `success: true/false` na resposta
- ✅ Trate códigos de erro HTTP (400, 401, 404, 429, 500)
- ✅ Implemente retry logic para erros temporários (429, 500)
- ✅ Logue erros para debugging

### Workflow Design
- ✅ Use webhooks para eventos em tempo real
- ✅ Use cron para tarefas agendadas
- ✅ Minimize chamadas de API com filtros eficientes
- ✅ Valide dados antes de enviar para a API

## ⚠️ 6. Troubleshooting

### Erro 401: Unauthorized

**Causa**: API key inválida ou expirada

**Solução**:
1. Verifique se a key está correta
2. Confirme que o header é `X-API-Key`
3. Gere uma nova key se necessário

### Erro 429: Rate Limit Exceeded

**Causa**: Muitas requisições em pouco tempo

**Solução**:
1. Aguarde 1 minuto antes de tentar novamente
2. Reduza frequência de chamadas
3. Use batch operations quando possível

### Erro 404: Not Found

**Causa**: Recurso não existe ou URL incorreta

**Solução**:
1. Verifique a URL do endpoint
2. Confirme que o ID do recurso existe
3. Veja documentação completa em `API_REFERENCE.md`

### Dados não aparecem

**Causa**: Filtro por user_id (RLS)

**Solução**:
- Cada API key está associada a um usuário
- Você só vê dados do seu usuário
- Verifique se está usando a key correta

## 📚 7. Recursos Adicionais

- [API Reference Completa](./API_REFERENCE.md) - Documentação de todos os endpoints
- [Postman Collection](./POSTMAN_COLLECTION.json) - Collection para testar
- Backend: http://localhost:3001
- Frontend: http://localhost:5173

## 💡 8. Ideias de Automações

1. **CRM Automation**
   - Criar clientes de formulários web
   - Sincronizar com Google Sheets
   - Importar contatos de outras ferramentas

2. **Appointment Management**
   - Integração com Google Calendar
   - Lembretes via WhatsApp/SMS
   - Confirmação automática de consultas

3. **Financial Automation**
   - Registrar pagamentos de gateways
   - Enviar faturas automaticamente
   - Alertas de pagamentos vencidos

4. **Reporting**
   - Relatórios semanais/mensais por email
   - Dashboards no Gra fana/Metabase
   - Notificações de métricas importantes

5. **Marketing**
   - Campanhas de follow-up
   - Aniversariantes do mês
   - Clientes inativos

## 🤝 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação completa
2. Verifique os logs do backend
3. Teste endpoints via Postman/cURL
4. Abra uma issue no repositório

---

**Juvenal CRM** - Sistema completo para gestão de clínicas de terapia e coaching
