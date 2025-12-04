const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function getAPIKeys() {
  console.log('🔍 Buscando API keys criadas...\n')

  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key, scopes, is_active, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('❌ Erro:', error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log('❌ Nenhuma API key ativa encontrada')
    return
  }

  console.log(`✅ ${data.length} API key(s) encontrada(s):\n`)

  data.forEach((key, index) => {
    console.log(`${index + 1}. ${key.name}`)
    console.log(`   Key: ${key.key}`)
    console.log(`   Scopes: ${key.scopes.join(', ')}`)
    console.log(`   Criada: ${new Date(key.created_at).toLocaleString('pt-BR')}`)
    console.log('')
  })

  return data[0].key
}

getAPIKeys().then(key => {
  if (key) {
    console.log('📋 Para testar, use esta key:')
    console.log(`   ${key}\n`)
  }
})
