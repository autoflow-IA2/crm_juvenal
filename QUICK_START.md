# 🚀 Quick Start - Juvenal CRM

## ✅ Status Atual

- ✅ Projeto configurado
- ✅ Dependências instaladas (271 pacotes)
- ✅ Build funcionando
- ✅ Supabase configurado (.env.local)
- ✅ Servidor rodando em: **http://localhost:5174**

---

## 🔐 Próximo Passo: Executar Migrations

As migrations ainda precisam ser executadas no Supabase para criar o banco de dados.

### Opção 1: SQL Editor (5 minutos)

1. **Acesse:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq

2. **Vá em:** SQL Editor (menu lateral)

3. **Execute cada arquivo na ordem:**

   **Migration 1:** Clique em "New query" e execute:
   ```
   Arquivo: supabase/migrations/001_initial_schema.sql
   ```
   Cole todo o conteúdo e clique em "Run"

   **Migration 2:** Nova query:
   ```
   Arquivo: supabase/migrations/002_row_level_security.sql
   ```
   Cole todo o conteúdo e clique em "Run"

   **Migration 3:** Nova query:
   ```
   Arquivo: supabase/migrations/003_views_and_functions.sql
   ```
   Cole todo o conteúdo e clique em "Run"

4. **Verificar:** Table Editor deve mostrar 9 tabelas

---

## 👤 Criar Usuário de Teste

### Via Aplicação (Recomendado)

1. **Acesse:** http://localhost:5174/register

2. **Preencha:**
   - Email: `admin@juvenalcrm.com`
   - Senha: `admin123`
   - Confirmar: `admin123`

3. **Clique em:** "Criar Conta"

4. **Faça login** com as mesmas credenciais

### Via Supabase Dashboard (Alternativa)

1. **Acesse:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/auth/users

2. **Clique em:** "Add user" → "Create new user"

3. **Preencha:**
   - Email: `admin@juvenalcrm.com`
   - Password: `admin123`
   - ✅ **Auto Confirm User** (importante!)

4. **Clique em:** "Create user"

---

## 🎯 Testar o Sistema

1. **Acesse:** http://localhost:5174/login

2. **Login:**
   ```
   Email: admin@juvenalcrm.com
   Senha: admin123
   ```

3. **Explore:**
   - 📊 Dashboard
   - 👥 Clientes (placeholder)
   - 📅 Agendamentos (placeholder)
   - 💰 Financeiro (placeholder)

4. **Teste o logout:**
   - Clique no ícone de usuário
   - Clique em "Sair"

---

## 📂 Arquivos Importantes

- `DEFAULT_LOGIN.md` - Instruções completas de login
- `INSTALLATION.md` - Guia passo-a-passo completo
- `SUPABASE_SETUP.md` - Setup detalhado do Supabase
- `NEXT_STEPS.md` - Próximas fases do projeto
- `CHECKLIST.md` - Todas as tarefas

---

## 🛠️ Comandos Úteis

```bash
# Servidor já está rodando em http://localhost:5174
# Para parar: Ctrl+C

# Rebuild (se necessário)
npm run build

# Verificar erros
npm run lint
```

---

## 🔍 Verificar Status

### Supabase Dashboard
- **Tabelas:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/editor
- **Usuários:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/auth/users
- **SQL Editor:** https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql

### Aplicação
- **Local:** http://localhost:5174
- **Login:** http://localhost:5174/login
- **Registro:** http://localhost:5174/register

---

## ✅ Checklist Rápido

- [ ] Executar migration 001
- [ ] Executar migration 002
- [ ] Executar migration 003
- [ ] Verificar 9 tabelas no Table Editor
- [ ] Criar usuário de teste
- [ ] Fazer login
- [ ] Navegar pelas páginas
- [ ] Fazer logout

---

## 🎉 Tudo Pronto?

Se você completou o checklist acima, o sistema está **100% funcional**!

**Próximos passos:** Consulte `NEXT_STEPS.md` para ver as próximas fases de desenvolvimento.

---

**Servidor:** ✅ Rodando em http://localhost:5174
**Migrations:** ⏳ Executar no SQL Editor do Supabase
**Usuário:** ⏳ Criar via registro ou dashboard
