# 🔧 Corrigir Erro: "Database error saving new user"

## Problema

Ao tentar registrar um novo usuário, aparece o erro: **"Database error saving new user"**

## Causa

O trigger `handle_new_user()` está falhando ao tentar criar as configurações padrão no banco de dados.

---

## ✅ Solução 1: Executar Migration de Correção (RECOMENDADO)

### Passo 1: Acessar o SQL Editor

1. Acesse: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql
2. Clique em **"New query"**

### Passo 2: Executar o Script de Correção

Copie e cole TODO o conteúdo do arquivo:
```
supabase/migrations/004_fix_trigger.sql
```

### Passo 3: Executar

Clique em **"Run"** (ou Ctrl+Enter)

Você deve ver: ✅ **"Trigger atualizado com sucesso!"**

### Passo 4: Testar

1. Volte para: http://localhost:5174/register
2. Tente criar uma conta novamente
3. Deve funcionar agora! ✅

---

## ✅ Solução 2: Desabilitar Temporariamente o Trigger

Se a Solução 1 não funcionar, você pode desabilitar temporariamente o trigger:

### No SQL Editor do Supabase:

```sql
-- Remover o trigger temporariamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

SELECT 'Trigger removido' as status;
```

**Agora você pode criar usuários normalmente!**

### ⚠️ Importante:
Com o trigger desabilitado, você precisará criar manualmente as configurações padrão:

```sql
-- Após criar um usuário, execute (substitua USER_ID pelo ID do usuário criado):
INSERT INTO public.user_settings (user_id)
VALUES ('USER_ID_AQUI');

INSERT INTO public.working_hours (user_id, day_of_week, start_time, end_time)
VALUES
  ('USER_ID_AQUI', 1, '09:00', '18:00'),
  ('USER_ID_AQUI', 2, '09:00', '18:00'),
  ('USER_ID_AQUI', 3, '09:00', '18:00'),
  ('USER_ID_AQUI', 4, '09:00', '18:00'),
  ('USER_ID_AQUI', 5, '09:00', '18:00');
```

---

## ✅ Solução 3: Criar Usuário Diretamente no Supabase

Alternativa: Crie o usuário diretamente no painel do Supabase:

### Passo 1: Acessar Authentication

https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/auth/users

### Passo 2: Criar Usuário

1. Clique em **"Add user"** → **"Create new user"**
2. Preencha:
   - **Email:** `admin@juvenalcrm.com`
   - **Password:** `admin123`
   - ✅ **Auto Confirm User** (MARQUE!)
3. Clique em **"Create user"**

### Passo 3: Criar Configurações Manualmente

Execute no SQL Editor:

```sql
-- Pegue o ID do usuário criado
SELECT id, email FROM auth.users WHERE email = 'admin@juvenalcrm.com';

-- Copie o ID e use nos comandos abaixo (substitua USER_ID):

-- Criar configurações
INSERT INTO public.user_settings (user_id)
VALUES ('USER_ID_AQUI');

-- Criar horários de trabalho
INSERT INTO public.working_hours (user_id, day_of_week, start_time, end_time)
VALUES
  ('USER_ID_AQUI', 1, '09:00', '18:00'),
  ('USER_ID_AQUI', 2, '09:00', '18:00'),
  ('USER_ID_AQUI', 3, '09:00', '18:00'),
  ('USER_ID_AQUI', 4, '09:00', '18:00'),
  ('USER_ID_AQUI', 5, '09:00', '18:00');
```

### Passo 4: Fazer Login

Acesse: http://localhost:5174/login

```
Email: admin@juvenalcrm.com
Senha: admin123
```

---

## 🔍 Verificar se o Problema Foi Resolvido

Execute o script de teste:

```bash
node test-supabase-connection.js
```

Depois tente registrar novamente em: http://localhost:5174/register

---

## 💡 Por Que Isso Acontece?

O Supabase tem restrições de segurança que podem impedir triggers de acessar tabelas no schema `public` quando executados no contexto do `auth.users`.

A correção adiciona:
- `SECURITY DEFINER` - Executa com permissões do dono da função
- `SET search_path = public` - Define o schema correto
- `EXCEPTION HANDLER` - Não quebra se houver erro
- `ON CONFLICT DO NOTHING` - Evita duplicações

---

## 📞 Ainda com Problemas?

Se nenhuma solução funcionou:

1. Verifique os logs de erro no Supabase:
   - Vá em: Database → Logs
   - Procure por erros relacionados a triggers

2. Verifique se as tabelas existem:
   ```bash
   node test-supabase-connection.js
   ```
   Deve mostrar 9/9 tabelas OK

3. Tente criar um usuário de teste manualmente (Solução 3)

---

**Recomendação:** Use a **Solução 1** primeiro, é a mais completa e resolve o problema permanentemente!
