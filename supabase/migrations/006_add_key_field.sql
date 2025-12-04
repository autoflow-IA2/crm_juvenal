-- Add key field to api_keys table
-- This stores the actual key (encrypted at rest by Supabase)
-- The key_hash field can still be used for validation

alter table api_keys
add column if not exists key text;

-- Make key_hash nullable (we'll use key field instead)
alter table api_keys
alter column key_hash drop not null;

comment on column api_keys.key is 'The actual API key (visible only once after creation)';
