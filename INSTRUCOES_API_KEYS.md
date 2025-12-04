# Instruções - Sistema de API Keys

## ✅ O que foi implementado

### Novos Arquivos (4)
- `src/services/apiKeys.ts` - Service completo de API keys
- `src/components/api-keys/CreateAPIKeyModal.tsx` - Modal para criar keys
- `src/components/api-keys/APIKeyCard.tsx` - Card de exibição
- `src/pages/APIKeysPage.tsx` - Página principal

### Modificações
- `src/App.tsx` - Rota `/api-keys` adicionada
- `src/components/layout/Sidebar.tsx` - Item "API Keys" adicionado
- `backend/.env` - CORS atualizado para porta 5174

### Migration
- `supabase/migrations/006_add_key_field.sql` - Adiciona campo `key`

---

## 🔧 Passo a Passo

### 1. Aplicar Migration no Supabase

**Acesse:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql

**Cole e execute este SQL:**

```sql
-- Add key field to api_keys table
alter table api_keys
add column if not exists key text;

-- Make key_hash nullable
alter table api_keys
alter column key_hash drop not null;

comment on column api_keys.key is 'The actual API key (visible only once after creation)';
```

### 2. Reiniciar Backend (se necessário)

O backend já está rodando, mas se precisar reiniciar:

```bash
cd backend
npm run dev
```

### 3. Acessar a Página de API Keys

Abra: http://localhost:5174/api-keys

Você verá:
- Botão "Nova API Key"
- Info card com instruções
- Empty state (ainda sem keys)

### 4. Criar Primeira API Key

1. Clique em "Nova API Key"
2. Preencha:
   - **Nome:** "Teste" (ou qualquer nome descritivo)
   - **Permissões:** Marque todas (read, write, delete)
   - **Expiração:** Deixe "Nunca expira"
3. Clique "Criar API Key"
4. **IMPORTANTE:** Uma tela aparecerá com a key
5. **COPIE A KEY AGORA** (não será mostrada novamente!)
6. Clique em "Fechar"

### 5. Testar a API Key

#### Opção A: Via Documentação Interativa

1. Acesse: http://localhost:5174/api-docs
2. No topo, cole a API key no campo "API Key"
3. Role até "Health Check"
4. Aba "Try It"
5. Clique "Try It"
6. Você verá a resposta: `{"success": true, "data": {...}}`

#### Opção B: Via cURL

```bash
curl -X GET \
  -H "X-API-Key: jcrm_live_XXXXXXXXX" \
  http://localhost:3001/api/v1/health
```

#### Opção C: Via Código

**JavaScript:**
```javascript
const response = await fetch('http://localhost:3001/api/v1/health', {
  headers: {
    'X-API-Key': 'jcrm_live_XXXXXXXXX'
  }
});
const data = await response.json();
console.log(data);
```

**Python:**
```python
import requests

response = requests.get(
    'http://localhost:3001/api/v1/health',
    headers={'X-API-Key': 'jcrm_live_XXXXXXXXX'}
)
print(response.json())
```

---

## 📋 Funcionalidades Disponíveis

### Na Página de API Keys

- ✅ **Listar todas as keys** do usuário logado
- ✅ **Criar nova key** com nome e permissões customizadas
- ✅ **Ver/ocultar key completa** (botão de olho)
- ✅ **Copiar key** com um clique
- ✅ **Ver status:** Ativa, Inativa, Expirada
- ✅ **Ativar/Desativar** keys
- ✅ **Deletar** keys (com confirmação)
- ✅ **Ver último uso** de cada key
- ✅ **Badges coloridos** para permissões

### Na Documentação API

- ✅ **APIKeyManager** no topo da página
- ✅ **Validação de formato** da key
- ✅ **Test Connection** para verificar se key é válida
- ✅ **Usar key nos requests** da aba "Try It"

---

## 🎯 Casos de Uso

### 1. Integração com n8n

1. Crie uma key com nome "n8n Production"
2. Permissões: read, write
3. Copie a key
4. Configure no n8n como HTTP Request Header:
   ```
   X-API-Key: jcrm_live_XXXXXXXXX
   ```

### 2. Webhook Externo

1. Crie key "Webhook Zapier"
2. Permissões: write (para criar dados)
3. Use em automações Zapier/Make

### 3. Script de Backup

1. Crie key "Backup Script"
2. Permissões: read (apenas leitura)
3. Use em script automatizado para exportar dados

### 4. Desenvolvimento/Teste

1. Crie key "Development"
2. Permissões: todas
3. Expiração: 7 dias
4. Use durante desenvolvimento

---

## 🔐 Segurança

### Boas Práticas

✅ **Use nomes descritivos** - Fácil identificar cada key
✅ **Permissões mínimas** - Dê apenas o necessário
✅ **Defina expiração** - Keys temporárias são mais seguras
✅ **Rotacione periodicamente** - Crie novas, delete antigas
✅ **Monitore último uso** - Identifique keys não utilizadas
✅ **Delete keys não usadas** - Reduz superfície de ataque

❌ **Nunca commite keys** no git
❌ **Não compartilhe keys** publicamente
❌ **Não use mesma key** em múltiplos lugares

### Row Level Security (RLS)

- ✅ Cada usuário vê apenas suas próprias keys
- ✅ Não pode acessar keys de outros usuários
- ✅ Policies do Supabase garantem isolamento

---

## 🐛 Troubleshooting

### Erro: "Could not find the table api_keys"

**Solução:** Aplique a migration 005 primeiro:
```sql
-- Verifique se a tabela existe
select * from api_keys limit 1;
```

### Erro: "column 'key' does not exist"

**Solução:** Aplique a migration 006 (instruções no início deste arquivo)

### Erro: "CORS error"

**Solução:** Certifique-se que backend/.env tem:
```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Erro: "Invalid API key format"

**Solução:** A key deve começar com `jcrm_live_` ou `jcrm_test_`

### Key não funciona na documentação

**Solução:**
1. Verifique se key está ativa
2. Teste com endpoint Health (não precisa de auth)
3. Verifique se backend está rodando (porta 3001)

---

## 📊 Status do Sistema

```
✅ Frontend: Rodando em http://localhost:5174
✅ Backend: Rodando em http://localhost:3001
✅ Supabase: Conectado
✅ Tabela api_keys: Existe
⏳ Migration 006: Aguardando aplicação manual
```

---

## 🚀 Próximos Passos

Após aplicar a migration:

1. ✅ Criar primeira API key
2. ✅ Testar na documentação interativa
3. ✅ Integrar com n8n/Zapier (se necessário)
4. ✅ Adicionar mais endpoints na documentação (32 restantes)
5. ✅ Configurar monitoring de uso de keys

---

**Qualquer dúvida, consulte:**
- Documentação API: http://localhost:5174/api-docs
- Backend README: `backend/README.md`
- API Reference: `docs/API_REFERENCE.md`

**Tudo pronto para usar! 🎉**
