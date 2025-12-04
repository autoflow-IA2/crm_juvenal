const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAllKeys() {
  console.log('🔍 Buscando TODAS as API keys...\n')

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Erro:', error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log('❌ Nenhuma API key encontrada no banco de dados')
    return
  }

  console.log(`✅ ${data.length} API key(s) encontrada(s):\n`)

  data.forEach((key, index) => {
    console.log(`${index + 1}. ${key.name}`)
    console.log(`   ID: ${key.id}`)
    console.log(`   User ID: ${key.user_id}`)
    console.log(`   Key: ${key.key || 'NULL'}`)
    console.log(`   Key Hash: ${key.key_hash ? key.key_hash.substring(0, 20) + '...' : 'NULL'}`)
    console.log(`   Active: ${key.is_active}`)
    console.log(`   Scopes: ${key.scopes?.join(', ') || 'none'}`)
    console.log(`   Criada: ${new Date(key.created_at).toLocaleString('pt-BR')}`)
    console.log('')
  })
}

checkAllKeys()
