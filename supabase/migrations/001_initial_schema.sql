-- Habilitar extensões necessárias
create extension if not exists "uuid-ossp";

-- Enum Types
create type client_status as enum ('active', 'inactive', 'archived');
create type session_type as enum (
  'individual_therapy',
  'coaching',
  'couples_therapy',
  'group_session',
  'first_consultation',
  'follow_up'
);
create type appointment_status as enum (
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);
create type transaction_type as enum ('income', 'expense');
create type transaction_category as enum (
  'session',
  'package',
  'product',
  'rent',
  'utilities',
  'marketing',
  'software',
  'equipment',
  'other'
);
create type payment_method as enum (
  'cash',
  'pix',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'health_insurance'
);
create type transaction_status as enum ('pending', 'paid', 'overdue', 'cancelled');
create type package_status as enum ('active', 'expired', 'completed');

-- Tabela: Clientes
create table clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text not null,
  birth_date date,
  cpf text,
  address text,
  city text,
  state text,
  zip_code text,
  emergency_contact text,
  emergency_phone text,
  notes text,
  status client_status default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para clientes
create index clients_user_id_idx on clients(user_id);
create index clients_status_idx on clients(status);
create index clients_name_idx on clients(name);

-- Tabela: Agendamentos
create table appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  date timestamptz not null,
  duration integer default 60,
  type session_type not null,
  status appointment_status default 'scheduled',
  notes text,
  session_notes text,
  price decimal(10,2) not null,
  is_paid boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para agendamentos
create index appointments_user_id_idx on appointments(user_id);
create index appointments_client_id_idx on appointments(client_id);
create index appointments_date_idx on appointments(date);
create index appointments_status_idx on appointments(status);

-- Tabela: Transações Financeiras
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  appointment_id uuid references appointments(id) on delete set null,
  type transaction_type not null,
  category transaction_category not null,
  description text not null,
  amount decimal(10,2) not null,
  date timestamptz not null,
  payment_method payment_method,
  status transaction_status default 'pending',
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para transações
create index transactions_user_id_idx on transactions(user_id);
create index transactions_client_id_idx on transactions(client_id);
create index transactions_date_idx on transactions(date);
create index transactions_type_idx on transactions(type);
create index transactions_status_idx on transactions(status);

-- Tabela: Pacotes de Sessões (templates)
create table session_packages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  sessions integer not null,
  price decimal(10,2) not null,
  validity_days integer default 90,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Tabela: Pacotes do Cliente (comprados)
create table client_session_packages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  package_id uuid references session_packages(id) on delete restrict not null,
  sessions_used integer default 0,
  purchase_date timestamptz default now(),
  expiration_date timestamptz not null,
  status package_status default 'active'
);

-- Tabela: Horários de Trabalho
create table working_hours (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week >= 0 and day_of_week <= 6),
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  unique(user_id, day_of_week)
);

-- Tabela: Bloqueios de Horário
create table blocked_slots (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  reason text
);

-- Tabela: Configurações do Usuário
create table user_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  clinic_name text,
  clinic_logo_url text,
  clinic_address text,
  clinic_phone text,
  default_session_duration integer default 60,
  default_session_price decimal(10,2),
  appointment_reminder_hours integer default 24,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabela: Tipos de Serviço (personalizáveis)
create table service_types (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  duration integer default 60,
  price decimal(10,2) not null,
  color text default '#22c55e',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Função para atualizar updated_at automaticamente
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers para updated_at
create trigger update_clients_updated_at
  before update on clients
  for each row execute function update_updated_at_column();

create trigger update_appointments_updated_at
  before update on appointments
  for each row execute function update_updated_at_column();

create trigger update_transactions_updated_at
  before update on transactions
  for each row execute function update_updated_at_column();

create trigger update_user_settings_updated_at
  before update on user_settings
  for each row execute function update_updated_at_column();
