-- Habilitar RLS em todas as tabelas
alter table clients enable row level security;
alter table appointments enable row level security;
alter table transactions enable row level security;
alter table session_packages enable row level security;
alter table client_session_packages enable row level security;
alter table working_hours enable row level security;
alter table blocked_slots enable row level security;
alter table user_settings enable row level security;
alter table service_types enable row level security;

-- Policies para Clientes
create policy "Users can view own clients"
  on clients for select
  using (auth.uid() = user_id);

create policy "Users can insert own clients"
  on clients for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clients"
  on clients for update
  using (auth.uid() = user_id);

create policy "Users can delete own clients"
  on clients for delete
  using (auth.uid() = user_id);

-- Policies para Agendamentos
create policy "Users can view own appointments"
  on appointments for select
  using (auth.uid() = user_id);

create policy "Users can insert own appointments"
  on appointments for insert
  with check (auth.uid() = user_id);

create policy "Users can update own appointments"
  on appointments for update
  using (auth.uid() = user_id);

create policy "Users can delete own appointments"
  on appointments for delete
  using (auth.uid() = user_id);

-- Policies para Transações
create policy "Users can view own transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on transactions for delete
  using (auth.uid() = user_id);

-- Policies para Session Packages
create policy "Users can view own session_packages"
  on session_packages for select
  using (auth.uid() = user_id);

create policy "Users can insert own session_packages"
  on session_packages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own session_packages"
  on session_packages for update
  using (auth.uid() = user_id);

create policy "Users can delete own session_packages"
  on session_packages for delete
  using (auth.uid() = user_id);

-- Policies para Client Session Packages
create policy "Users can view own client_session_packages"
  on client_session_packages for select
  using (auth.uid() = user_id);

create policy "Users can insert own client_session_packages"
  on client_session_packages for insert
  with check (auth.uid() = user_id);

create policy "Users can update own client_session_packages"
  on client_session_packages for update
  using (auth.uid() = user_id);

create policy "Users can delete own client_session_packages"
  on client_session_packages for delete
  using (auth.uid() = user_id);

-- Policies para Working Hours
create policy "Users can view own working_hours"
  on working_hours for select
  using (auth.uid() = user_id);

create policy "Users can insert own working_hours"
  on working_hours for insert
  with check (auth.uid() = user_id);

create policy "Users can update own working_hours"
  on working_hours for update
  using (auth.uid() = user_id);

create policy "Users can delete own working_hours"
  on working_hours for delete
  using (auth.uid() = user_id);

-- Policies para Blocked Slots
create policy "Users can view own blocked_slots"
  on blocked_slots for select
  using (auth.uid() = user_id);

create policy "Users can insert own blocked_slots"
  on blocked_slots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own blocked_slots"
  on blocked_slots for update
  using (auth.uid() = user_id);

create policy "Users can delete own blocked_slots"
  on blocked_slots for delete
  using (auth.uid() = user_id);

-- Policies para User Settings
create policy "Users can view own settings"
  on user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own settings"
  on user_settings for update
  using (auth.uid() = user_id);

-- Policies para Service Types
create policy "Users can view own service_types"
  on service_types for select
  using (auth.uid() = user_id);

create policy "Users can insert own service_types"
  on service_types for insert
  with check (auth.uid() = user_id);

create policy "Users can update own service_types"
  on service_types for update
  using (auth.uid() = user_id);

create policy "Users can delete own service_types"
  on service_types for delete
  using (auth.uid() = user_id);
