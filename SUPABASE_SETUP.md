# Guia de Configuração do Supabase

Siga estes passos para configurar o Supabase para o projeto Juvenal CRM.

## 1. Criar Conta e Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Clique em "Start your project" e faça login (pode usar GitHub)
3. Clique em "New Project"
4. Preencha:
   - **Name:** juvenal-crm (ou o nome que preferir)
   - **Database Password:** Escolha uma senha forte (salve-a em local seguro)
   - **Region:** Escolha a região mais próxima (ex: South America - São Paulo)
5. Clique em "Create new project" e aguarde a criação (pode levar 1-2 minutos)

## 2. Obter as Credenciais

1. No painel do projeto, vá em **Settings** (ícone de engrenagem no menu lateral)
2. Clique em **API**
3. Você verá duas informações importantes:
   - **Project URL** - A URL do seu projeto
   - **anon public** key - A chave pública (clique em "Reveal" para ver)

## 3. Configurar o Arquivo .env.local

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores de exemplo pelas suas credenciais:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_key_aqui
```

**IMPORTANTE:** Nunca compartilhe ou faça commit do arquivo `.env.local` com as credenciais reais!

## 4. Executar as Migrations do Banco de Dados

### Opção A: Usando o SQL Editor (Recomendado para iniciantes)

1. No painel do Supabase, vá em **SQL Editor** (no menu lateral)
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `supabase/migrations/001_initial_schema.sql`
4. Clique em "Run" (ou pressione Ctrl+Enter)
5. Aguarde a confirmação "Success. No rows returned"
6. Repita os passos 2-5 para os arquivos:
   - `supabase/migrations/002_row_level_security.sql`
   - `supabase/migrations/003_views_and_functions.sql`

### Opção B: Usando o Supabase CLI (Para usuários avançados)

1. Instale a CLI do Supabase:
```bash
npm install -g supabase
```

2. Faça login:
```bash
supabase login
```

3. Link com seu projeto:
```bash
supabase link --project-ref seu-project-ref
```

4. Execute as migrations:
```bash
supabase db push
```

## 5. Verificar se Tudo Está Funcionando

1. No painel do Supabase, vá em **Table Editor**
2. Você deve ver todas as tabelas criadas:
   - clients
   - appointments
   - transactions
   - session_packages
   - client_session_packages
   - working_hours
   - blocked_slots
   - user_settings
   - service_types

3. Clique em qualquer tabela e vá na aba **Policies** - você deve ver as políticas RLS criadas

## 6. Testar a Aplicação

1. No terminal, execute:
```bash
npm run dev
```

2. Acesse http://localhost:5173
3. Tente criar uma nova conta na página de registro
4. Se tudo estiver correto, você será redirecionado para o login
5. Faça login e você deve ver o dashboard

## 7. Configurar Email (Opcional - Para Recuperação de Senha)

Por padrão, o Supabase usa emails temporários para desenvolvimento. Para produção:

1. Vá em **Authentication** > **Email Templates**
2. Configure seu provedor de email (SMTP)
3. Personalize os templates de email

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Certifique-se de que as variáveis começam com `VITE_`
- Reinicie o servidor de desenvolvimento (`npm run dev`)

### Erro ao executar migrations
- Verifique se você está executando os arquivos na ordem correta
- Certifique-se de que o projeto foi criado com sucesso no Supabase
- Verifique se não há erros de sintaxe SQL

### Não consigo fazer login
- Verifique se as migrations foram executadas corretamente
- Vá em **Authentication** > **Users** no Supabase para ver se o usuário foi criado
- Verifique se o RLS foi habilitado (migration 002)

### "Auth session missing!"
- Limpe o localStorage do navegador
- Faça logout e login novamente
- Verifique se as credenciais no `.env.local` estão corretas

## Recursos Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
