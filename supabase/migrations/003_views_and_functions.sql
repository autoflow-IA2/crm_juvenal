-- View: Resumo financeiro mensal
create or replace view monthly_financial_summary as
select
  user_id,
  date_trunc('month', date) as month,
  sum(case when type = 'income' then amount else 0 end) as total_income,
  sum(case when type = 'expense' then amount else 0 end) as total_expenses,
  sum(case when type = 'income' then amount else -amount end) as net_profit,
  count(case when type = 'income' then 1 end) as income_count,
  count(case when type = 'expense' then 1 end) as expense_count
from transactions
where status != 'cancelled'
group by user_id, date_trunc('month', date);

-- View: Estatísticas de agendamentos
create or replace view appointment_stats as
select
  user_id,
  date_trunc('month', date) as month,
  count(*) as total_appointments,
  count(case when status = 'completed' then 1 end) as completed,
  count(case when status = 'cancelled' then 1 end) as cancelled,
  count(case when status = 'no_show' then 1 end) as no_shows,
  round(
    count(case when status = 'completed' then 1 end)::decimal /
    nullif(count(case when status in ('completed', 'cancelled', 'no_show') then 1 end), 0) * 100,
    2
  ) as attendance_rate
from appointments
group by user_id, date_trunc('month', date);

-- Função: Buscar horários disponíveis
create or replace function get_available_slots(
  p_user_id uuid,
  p_date date,
  p_duration integer default 60
)
returns table (
  slot_start time,
  slot_end time
) as $$
declare
  v_day_of_week integer;
  v_working_start time;
  v_working_end time;
  v_slot time;
begin
  v_day_of_week := extract(dow from p_date)::integer;

  -- Buscar horário de trabalho do dia
  select start_time, end_time into v_working_start, v_working_end
  from working_hours
  where user_id = p_user_id
    and day_of_week = v_day_of_week
    and is_active = true;

  if v_working_start is null then
    return;
  end if;

  -- Gerar slots e filtrar ocupados/bloqueados
  v_slot := v_working_start;
  while v_slot + (p_duration || ' minutes')::interval <= v_working_end loop
    -- Verificar se não há agendamento
    if not exists (
      select 1 from appointments
      where user_id = p_user_id
        and date::date = p_date
        and status not in ('cancelled')
        and (
          (date::time, date::time + (duration || ' minutes')::interval)
          overlaps
          (v_slot, v_slot + (p_duration || ' minutes')::interval)
        )
    )
    -- Verificar se não está bloqueado
    and not exists (
      select 1 from blocked_slots
      where user_id = p_user_id
        and date = p_date
        and (start_time, end_time) overlaps (v_slot, v_slot + (p_duration || ' minutes')::interval)
    )
    then
      slot_start := v_slot;
      slot_end := v_slot + (p_duration || ' minutes')::interval;
      return next;
    end if;

    v_slot := v_slot + '30 minutes'::interval;
  end loop;

  return;
end;
$$ language plpgsql security definer;

-- Função: Criar configurações padrão para novo usuário
create or replace function handle_new_user()
returns trigger as $$
begin
  -- Criar configurações padrão
  insert into user_settings (user_id)
  values (new.id);

  -- Criar horários de trabalho padrão (seg-sex, 9h-18h)
  insert into working_hours (user_id, day_of_week, start_time, end_time)
  values
    (new.id, 1, '09:00', '18:00'),
    (new.id, 2, '09:00', '18:00'),
    (new.id, 3, '09:00', '18:00'),
    (new.id, 4, '09:00', '18:00'),
    (new.id, 5, '09:00', '18:00');

  return new;
end;
$$ language plpgsql security definer;

-- Trigger para novos usuários
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
