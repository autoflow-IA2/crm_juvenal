-- Migration: Sistema de API Keys para integração externa
-- Permite autenticação via API Key para sistemas como n8n

-- Tabela para armazenar API Keys
create table api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,                    -- Nome descritivo (ex: "n8n Production")
  key_hash text not null unique,         -- Hash SHA-256 da API key
  key_prefix text not null,              -- Primeiros 8 chars para identificação
  scopes text[] default '{"read","write","delete"}',  -- Permissões
  last_used_at timestamptz,              -- Último uso
  expires_at timestamptz,                -- Expiração (opcional)
  is_active boolean default true,        -- Ativa/desativada
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Comentários para documentação
comment on table api_keys is 'API Keys para autenticação de sistemas externos';
comment on column api_keys.key_hash is 'SHA-256 hash da API key completa';
comment on column api_keys.key_prefix is 'Primeiros 8 caracteres da key para identificação visual';
comment on column api_keys.scopes is 'Permissões: read, write, delete';
comment on column api_keys.last_used_at is 'Timestamp do último uso da API key';

-- Índices para performance
create index api_keys_user_id_idx on api_keys(user_id);
create index api_keys_key_hash_idx on api_keys(key_hash);
create index api_keys_is_active_idx on api_keys(is_active);
create index api_keys_expires_at_idx on api_keys(expires_at) where expires_at is not null;

-- Habilitar RLS
alter table api_keys enable row level security;

-- Policies: Usuários podem gerenciar apenas suas próprias API keys
create policy "Users can view own api_keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can insert own api_keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can update own api_keys"
  on api_keys for update
  using (auth.uid() = user_id);

create policy "Users can delete own api_keys"
  on api_keys for delete
  using (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
create trigger update_api_keys_updated_at
  before update on api_keys
  for each row execute function update_updated_at_column();

-- Função para limpar API keys expiradas (pode ser chamada via cron job)
create or replace function cleanup_expired_api_keys()
returns integer as $$
declare
  deleted_count integer;
begin
  delete from api_keys
  where expires_at is not null
    and expires_at < now()
    and is_active = false;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$ language plpgsql security definer;

comment on function cleanup_expired_api_keys is 'Remove API keys expiradas e inativas do banco de dados';
