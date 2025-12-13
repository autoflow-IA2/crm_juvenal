# 🔐 Login Padrão - Juvenal CRM

## Credenciais de Teste

```
Email:    admin@juvenalcrm.com
Senha:    admin123
```

---

## 🚀 Método 1: Criar via Aplicação (RECOMENDADO)

Este é o método mais simples e seguro:

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** http://localhost:5173

3. **Clique em "Cadastre-se"**

4. **Preencha:**
   - Email: `admin@juvenalcrm.com`
   - Senha: `admin123`
   - Confirmar Senha: `admin123`

5. **Clique em "Criar Conta"**

6. **Faça login** com as mesmas credenciais

✅ **Pronto!** O usuário está criado e todas as configurações padrão foram aplicadas automaticamente.

---

## 🎛️ Método 2: Criar via Supabase Dashboard

Se preferir criar diretamente no Supabase:

1. **Acesse o painel do Supabase:** https://supabase.com/dashboard

2. **Vá em:** Authentication → Users

3. **Clique em:** "Add user" → "Create new user"

4. **Preencha:**
   - **Email:** `admin@juvenalcrm.com`
   - **Password:** `admin123`
   - **Auto Confirm User:** ✅ **MARQUE ESTA OPÇÃO!**

5. **Clique em:** "Create user"

✅ **Pronto!** O usuário foi criado e o trigger automático criou:
- Configurações em `user_settings`
- Horários de trabalho padrão (Seg-Sex, 9h-18h) em `working_hours`

---

## 🔍 Verificar se o Usuário Foi Criado

### No Supabase Dashboard:

1. **Authentication → Users**
   - ✅ Deve aparecer: `admin@juvenalcrm.com`

2. **Table Editor → user_settings**
   - ✅ Deve ter 1 registro com as configurações padrão

3. **Table Editor → working_hours**
   - ✅ Deve ter 5 registros (Seg-Sex, 9h-18h)

### Na Aplicação:

1. Acesse: http://localhost:5173/login
2. Entre com:
   - Email: `admin@juvenalcrm.com`
   - Senha: `admin123`
3. ✅ Deve entrar no Dashboard

---

## 🔄 Criar Mais Usuários de Teste

Você pode criar quantos usuários quiser:

**Via Aplicação:**
- Use a página de registro: http://localhost:5173/register

**Via Supabase:**
- Authentication → Users → Add user

**Sugestões:**
```
Usuário 1:
Email: terapeuta1@juvenalcrm.com
Senha: senha123

Usuário 2:
Email: terapeuta2@juvenalcrm.com
Senha: senha123

Usuário 3:
Email: coach@juvenalcrm.com
Senha: senha123
```

---

## 🗑️ Deletar Usuário de Teste

Se quiser remover o usuário:

1. **No Supabase:** Authentication → Users
2. Encontre o usuário
3. Clique nos "..." → Delete user
4. Confirme

Isso irá remover:
- ✅ O usuário de `auth.users`
- ✅ Todos os dados relacionados (clients, appointments, etc.) devido ao `CASCADE`

---

## 🔐 Segurança em Produção

**IMPORTANTE:** Estas credenciais são apenas para desenvolvimento!

Em produção:
- ❌ NÃO use senhas fracas como "admin123"
- ❌ NÃO compartilhe credenciais
- ✅ Use senhas fortes (mínimo 12 caracteres)
- ✅ Considere autenticação de dois fatores
- ✅ Monitore logins suspeitos

---

## 📝 Notas

- O Supabase envia email de confirmação por padrão
- Em desenvolvimento, você pode marcar "Auto Confirm User"
- O trigger `handle_new_user()` cria automaticamente:
  - Configurações padrão em `user_settings`
  - Horários de trabalho em `working_hours` (Seg-Sex, 9h-18h)
- Cada usuário vê apenas seus próprios dados (Row Level Security)

---

## 🎯 Login Rápido

**Já configurou tudo?** Use este atalho:

```
http://localhost:5173/login

Email: admin@juvenalcrm.com
Senha: admin123
```

**Status das Migrations:** ✅ Executadas
**Status do Servidor:** ⏳ Executar `npm run dev`
**Status do Usuário:** ⏳ Criar via aplicação ou Supabase
