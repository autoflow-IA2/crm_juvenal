# 🚀 Guia Rápido de Instalação - Juvenal CRM

## ⏱️ Tempo Total: 15-20 minutos

---

## Passo 1: Verificar Instalação (✅ JÁ FEITO!)

O projeto já está instalado e pronto! Você já tem:

- ✅ 43 arquivos criados
- ✅ Node modules instalados (271 pacotes)
- ✅ Build testado e funcionando
- ✅ TypeScript compilando sem erros

---

## Passo 2: Configurar Supabase (15-20 minutos)

### 2.1. Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta (pode usar GitHub)
3. Clique em **"New Project"**
4. Preencha os dados:
   - **Name:** `juvenal-crm`
   - **Database Password:** (escolha uma senha forte e anote!)
   - **Region:** South America (São Paulo)
5. Clique em **"Create new project"**
6. ⏱️ Aguarde 1-2 minutos enquanto o projeto é criado

### 2.2. Obter Credenciais

1. No painel do projeto, vá em **Settings** (ícone de engrenagem)
2. Clique em **API**
3. Copie os seguintes valores:
   - **Project URL** (ex: https://xxxxx.supabase.co)
   - **anon public key** (clique em "Reveal" para ver)

### 2.3. Configurar .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua as credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Salve o arquivo

### 2.4. Executar Migrations (Criar Banco de Dados)

1. No painel do Supabase, vá em **SQL Editor** (menu lateral)
2. Clique em **"New query"**
3. Abra o arquivo `supabase/migrations/001_initial_schema.sql`
4. Copie TODO o conteúdo
5. Cole no SQL Editor do Supabase
6. Clique em **"Run"** (ou Ctrl+Enter)
7. ✅ Aguarde a mensagem "Success. No rows returned"

8. Repita os passos 2-7 para os arquivos:
   - `supabase/migrations/002_row_level_security.sql`
   - `supabase/migrations/003_views_and_functions.sql`

### 2.5. Verificar Banco de Dados

1. No Supabase, vá em **Table Editor**
2. Você deve ver 9 tabelas criadas:
   - ✅ clients
   - ✅ appointments
   - ✅ transactions
   - ✅ session_packages
   - ✅ client_session_packages
   - ✅ working_hours
   - ✅ blocked_slots
   - ✅ user_settings
   - ✅ service_types

---

## Passo 3: Iniciar o Servidor (1 minuto)

```bash
npm run dev
```

Você verá:

```
  VITE v5.4.21  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

---

## Passo 4: Testar (5 minutos)

### 4.1. Criar Conta

1. Acesse http://localhost:5173
2. Você será redirecionado para `/login`
3. Clique em **"Cadastre-se"**
4. Preencha:
   - Email: `seu@email.com`
   - Senha: `senha123` (mínimo 6 caracteres)
   - Confirmar Senha: `senha123`
5. Clique em **"Criar Conta"**
6. ✅ Você verá "Conta criada com sucesso!"

### 4.2. Fazer Login

1. Você será redirecionado para `/login`
2. Faça login com:
   - Email: `seu@email.com`
   - Senha: `senha123`
3. Clique em **"Entrar"**
4. ✅ Você será levado ao Dashboard

### 4.3. Explorar o Sistema

1. Navegue pelos menus:
   - 📊 **Dashboard** - Visão geral (ainda vazio)
   - 👥 **Clientes** - Gestão de clientes (placeholder)
   - 📅 **Agendamentos** - Calendário (placeholder)
   - 💰 **Financeiro** - Controle financeiro (placeholder)

2. Teste o menu do usuário:
   - Clique no ícone de usuário (canto superior direito)
   - Clique em **"Sair"**
   - ✅ Você volta para a tela de login

### 4.4. Verificar no Supabase

1. No Supabase, vá em **Authentication** > **Users**
2. ✅ Você deve ver seu usuário criado

3. Vá em **Table Editor** > **user_settings**
4. ✅ Você deve ver uma configuração criada automaticamente

5. Vá em **Table Editor** > **working_hours**
6. ✅ Você deve ver 5 horários (seg-sex, 9h-18h) criados automaticamente

---

## ✅ Checklist Final

Marque cada item conforme completa:

- [ ] Projeto Supabase criado
- [ ] Credenciais copiadas e coladas no .env.local
- [ ] Migration 001 executada com sucesso
- [ ] Migration 002 executada com sucesso
- [ ] Migration 003 executada com sucesso
- [ ] 9 tabelas aparecem no Table Editor
- [ ] Servidor iniciado (npm run dev)
- [ ] Consegui acessar http://localhost:5173
- [ ] Consegui criar uma conta
- [ ] Consegui fazer login
- [ ] Consegui navegar entre as páginas
- [ ] Consegui fazer logout
- [ ] Usuário aparece no Supabase Auth
- [ ] Configurações criadas automaticamente

---

## 🎉 Pronto!

Se você marcou todos os itens acima, o sistema está **100% funcional** e pronto para desenvolvimento!

---

## 🐛 Problemas Comuns

### "Missing Supabase environment variables"

**Causa:** .env.local não configurado ou servidor não reiniciado

**Solução:**
1. Verifique se o arquivo `.env.local` existe na raiz
2. Verifique se os valores estão corretos (sem aspas)
3. Pare o servidor (Ctrl+C) e execute `npm run dev` novamente

### "Invalid API key"

**Causa:** Credenciais incorretas no .env.local

**Solução:**
1. Volte ao Supabase > Settings > API
2. Copie novamente a **anon public key**
3. Cole no .env.local
4. Reinicie o servidor

### Erro ao executar migrations

**Causa:** SQL executado fora de ordem ou com erro

**Solução:**
1. No Supabase, vá em SQL Editor
2. Execute este comando para limpar tudo:
```sql
drop schema public cascade;
create schema public;
```
3. Execute as migrations novamente NA ORDEM (001, 002, 003)

### "Cannot read properties of null"

**Causa:** Tentando acessar dados sem estar logado

**Solução:**
1. Limpe o cache do navegador (F12 > Application > Clear storage)
2. Faça logout e login novamente

### Build falha

**Causa:** Algum arquivo TypeScript com erro

**Solução:**
```bash
npm run build
# Veja qual arquivo tem erro e corrija
```

---

## 📚 Próximos Passos

Agora que tudo está funcionando, você pode:

1. **Explorar o código** - Veja como os componentes foram feitos
2. **Ler a documentação** - Confira `README.md` e `NEXT_STEPS.md`
3. **Começar a Fase 2** - Implementar autenticação completa
4. **Customizar** - Mudar cores, textos, etc.

---

## 🆘 Precisa de Ajuda?

- **Documentação completa:** Veja `SUPABASE_SETUP.md` para mais detalhes
- **Troubleshooting:** Veja seção de problemas em `SUPABASE_SETUP.md`
- **Roadmap:** Veja `NEXT_STEPS.md` para as próximas fases
- **Checklist:** Veja `CHECKLIST.md` para todas as tarefas

---

**Tempo total gasto:** ______ minutos

**Status:** [ ] Funcionando perfeitamente! 🎉
