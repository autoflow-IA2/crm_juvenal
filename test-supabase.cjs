const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...\n')

  // Test 1: Check if we can query users
  const { data: authData, error: authError } = await supabase.auth.getSession()
  console.log('✅ Auth OK:', authError ? 'Error: ' + authError.message : 'Connected')

  // Test 2: Check if api_keys table exists
  const { data: apiKeysData, error: apiKeysError } = await supabase
    .from('api_keys')
    .select('count')
    .limit(1)

  console.log('✅ api_keys table:', apiKeysError ? '❌ Not found: ' + apiKeysError.message : '✓ Exists')

  // Test 3: List all tables
  const { data: tables, error: tablesError } = await supabase
    .rpc('get_tables')
    .catch(() => null)

  if (!apiKeysError) {
    console.log('\n📊 Tabelas disponíveis:')
    const { data, error } = await supabase.from('api_keys').select('*').limit(0)
    if (!error) {
      console.log('  - api_keys ✓')
    }
  }
}

testConnection().catch(console.error)
