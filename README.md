# Juvenal CRM

Sistema de CRM completo para clínicas de terapia e coaching de desenvolvimento pessoal.

## Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router v6
- **Estado Global:** Zustand
- **Backend/BaaS:** Supabase (PostgreSQL + Auth + Storage + Real-time)
- **Validação:** Zod
- **Ícones:** Heroicons

## Primeiros Passos

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie as credenciais (URL e Anon Key)
4. Configure o arquivo `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Executar Migrations

No painel do Supabase, vá em **SQL Editor** e execute os arquivos de migration na ordem:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_row_level_security.sql`
3. `supabase/migrations/003_views_and_functions.sql`

### 4. Criar Usuário de Teste

Você pode criar um usuário de duas formas:

**Opção A: Via aplicação (mais fácil)**
- Acesse http://localhost:5173/register
- Email: `admin@juvenalcrm.com`
- Senha: `admin123`

**Opção B: Via Supabase Dashboard**
- Veja instruções em `DEFAULT_LOGIN.md`

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

**Login padrão:** `admin@juvenalcrm.com` / `admin123`

## Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm run lint` - Executa o linter (ESLint)

## Estrutura do Projeto

```
juvenalcrm/
├── src/
│   ├── components/
│   │   ├── ui/           # Componentes base reutilizáveis
│   │   └── layout/       # Header, Sidebar
│   ├── pages/            # Páginas da aplicação
│   ├── hooks/            # Custom hooks (useAuth, etc)
│   ├── lib/              # Cliente Supabase
│   ├── services/         # Serviços (auth, clients, etc)
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Funções utilitárias
├── supabase/
│   └── migrations/       # SQL migrations
└── public/               # Arquivos estáticos
```

## Funcionalidades Implementadas (Fase 1)

- ✅ Setup do projeto com React + Vite + TypeScript + Tailwind
- ✅ Configuração do Supabase
- ✅ Sistema de autenticação (login, registro, recuperação de senha)
- ✅ Layout base com Sidebar e Header
- ✅ Componentes UI base (Button, Input, Card, Textarea)
- ✅ Estrutura de rotas protegidas
- ✅ Migrations do banco de dados

## Próximas Fases

- **Fase 2:** Módulo de Autenticação completo
- **Fase 3:** Módulo de Clientes (CRUD completo)
- **Fase 4:** Módulo de Agendamentos (Calendário)
- **Fase 5:** Módulo Financeiro (Dashboard e transações)
- **Fase 6:** Refinamentos e responsividade

## Desenvolvendo com Supabase

### Gerar Tipos TypeScript

Após modificar o schema do banco de dados, atualize os tipos:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
```

Ou com a CLI do Supabase:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_ID
supabase gen types typescript --local > src/types/database.types.ts
```

### Row Level Security (RLS)

Todas as tabelas estão protegidas com RLS. Cada usuário só pode ver e modificar seus próprios dados.

### Real-time

O Supabase oferece atualizações em tempo real. Use nos módulos de agendamento para sincronização automática.

## Licença

Projeto privado - © 2024
