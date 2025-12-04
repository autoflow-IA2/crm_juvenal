const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzI5OTc5MSwiZXhwIjoyMDQ4ODc1NzkxfQ.bTPVyR0PqKJ_3LxS-oTIk8zYvR6WfgC5ATvBEbfQ8i0'

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createTestKey() {
  console.log('🔑 Criando API key de teste via service role...\n')

  // Get user from profiles table instead
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .limit(1)
    .single()

  if (profilesError || !profiles) {
    console.error('❌ Erro ao buscar perfis:', profilesError?.message || 'Nenhum perfil encontrado')
    return
  }

  const userId = profiles.id
  console.log(`👤 Usando user_id: ${userId}`)

  const testKey = 'jcrm_live_TESTk85rdvtRbkP1YXO4e3SP72jcv0ZZWq4B'

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: userId,
      name: 'Test Key via Service Role',
      key: testKey,
      key_hash: testKey,
      key_prefix: testKey.substring(0, 8),
      scopes: ['read', 'write', 'delete'],
      is_active: true
    })
    .select()
    .single()

  if (error) {
    console.error('❌ Erro ao criar key:', error.message)
    console.error('   Código:', error.code)
    console.error('   Detalhes:', error.details)
    return
  }

  console.log('\n✅ API Key criada com sucesso!')
  console.log('   ID:', data.id)
  console.log('   Nome:', data.name)
  console.log('   Key:', data.key)
  console.log('   Active:', data.is_active)
  console.log('\n📋 Use esta key para testar:')
  console.log(`   ${testKey}\n`)
}

createTestKey()
