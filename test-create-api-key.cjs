const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCreateAPIKey() {
  console.log('🧪 Testando criação de API key...\n')

  // 1. Check if migration was applied
  console.log('1️⃣ Verificando se migration foi aplicada...')
  const { data: columns, error: schemaError } = await supabase
    .rpc('get_columns', { table_name: 'api_keys' })
    .catch(() => null)

  // Alternative: Try to select with key field
  const { data: testData, error: testError } = await supabase
    .from('api_keys')
    .select('id, key, user_id')
    .limit(0)

  if (testError) {
    if (testError.message.includes('column "key" does not exist')) {
      console.log('❌ Campo "key" NÃO existe!')
      console.log('   Você precisa aplicar a migration primeiro.\n')
      console.log('   Acesse: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql')
      console.log('   E execute o SQL da migration 006.\n')
      return
    } else {
      console.log('❌ Erro ao verificar schema:', testError.message)
      return
    }
  }

  console.log('✅ Campo "key" existe!\n')

  // 2. Check auth
  console.log('2️⃣ Verificando autenticação...')
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    console.log('❌ Usuário não está autenticado!')
    console.log('   Você precisa fazer login primeiro no frontend.\n')
    return
  }

  console.log('✅ Usuário autenticado:', session.user.email)
  console.log('   User ID:', session.user.id, '\n')

  // 3. Try to create API key
  console.log('3️⃣ Tentando criar API key...')

  const randomKey = 'jcrm_live_' + Math.random().toString(36).substring(2, 34)

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: session.user.id,
      name: 'Test Key',
      key: randomKey,
      scopes: ['read', 'write'],
      key_prefix: randomKey.substring(0, 8),
      key_hash: 'dummy_hash_' + Date.now(), // Dummy hash
    })
    .select()
    .single()

  if (error) {
    console.log('❌ Erro ao criar:', error.message)
    console.log('   Detalhes:', error)
    return
  }

  console.log('✅ API key criada com sucesso!')
  console.log('   ID:', data.id)
  console.log('   Key:', data.key)
  console.log('   Name:', data.name)
}

testCreateAPIKey().catch(console.error)
