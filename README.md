# 🧠 Juvenal CRM

> Sistema de Gestão Inteligente para Clínicas de Terapia e Coaching.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📸 Visão Geral do Projeto

![Dashboard Preview](./public/dashboard-preview.png)

O **Juvenal CRM** resolve a desorganização administrativa de terapeutas e coaches. Ele centraliza agendamentos, prontuários e financeiro em uma interface limpa e segura, com dados protegidos individualmente (RLS).

## 🛠️ Stack Tecnológica

Este projeto foi construído com foco em performance, tipagem estática e escalabilidade.

| Categoria | Tecnologias |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript |
| **Estilização** | Tailwind CSS, Shadcn/UI (ou Heroicons) |
| **State Management** | Zustand |
| **Backend / BaaS** | Supabase (Auth, DB, Realtime, Storage) |
| **Segurança** | Row Level Security (RLS), Zod Validation |

---

## 🚀 Funcionalidades (Status Atual)

### ✅ Fase 1: Core & Segurança (Concluído)
- [x] **Autenticação Robusta:** Login, Registro e Recuperação de senha via Supabase Auth.
- [x] **Arquitetura Segura:** Implementação de RLS (Row Level Security) - cada terapeuta vê apenas seus dados.
- [x] **Interface Responsiva:** Layout com Sidebar dinâmica e componentes reutilizáveis.
- [x] **Banco de Dados:** Modelagem Relacional e Migrations automatizadas.

### 🚧 Roadmap (Próximos Passos)
- [ ] **Módulo de Agendamentos:** Calendário Drag-and-drop.
- [ ] **Integração com IA:** Resumo automático de sessões (Feature futura).
- [ ] **Financeiro:** Dashboard de faturamento mensal.

---

## 💻 Como Rodar Localmente

Siga os passos abaixo para ter o ambiente de desenvolvimento rodando em sua máquina.

### 1. Instalar Dependências
```bash
npm install

2. Configurar Variáveis de Ambiente
Crie um arquivo .env.local na raiz do projeto:

3. Banco de Dados (Supabase)
Execute as migrations na ordem para criar as tabelas e políticas de segurança:

supabase/migrations/001_initial_schema.sql

supabase/migrations/002_row_level_security.sql

supabase/migrations/003_views_and_functions.sql

4. Rodar o Projeto
Bash

npm run dev
Acesse: http://localhost:5173

Credenciais de Teste (Ambiente Local):

User: admin@juvenalcrm.com

Pass: admin123

📂 Estrutura do Projeto
A arquitetura foi pensada para facilitar a manutenção e escalabilidade.

Plaintext

juvenalcrm/
├── src/
│   ├── components/   # UI Kit e Layouts
│   ├── hooks/        # Lógica reutilizável (useAuth, useClient)
│   ├── lib/          # Configuração do Supabase Client
│   ├── services/     # Camada de API e comunicação com DB
│   ├── types/        # Definições globais do TypeScript
│   └── store/        # Gerenciamento de estado (Zustand)
└── supabase/         # Migrations e Snapshots do DB

Developed with 💜 by Yuri Souza
