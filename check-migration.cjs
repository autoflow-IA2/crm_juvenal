const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkMigration() {
  console.log('🔍 Verificando se migration foi aplicada...\n')

  // Try to select including 'key' field
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key, user_id, name')
    .limit(0)

  if (error) {
    if (error.message.includes('column "key" does not exist') ||
        error.code === '42703') {
      console.log('❌ MIGRATION NÃO APLICADA!')
      console.log('\n📋 O campo "key" ainda não existe na tabela api_keys.')
      console.log('\n⚠️  AÇÃO NECESSÁRIA:')
      console.log('   1. Acesse: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql')
      console.log('   2. Cole e execute este SQL:\n')
      console.log('   ━'.repeat(40))
      console.log('   alter table api_keys add column if not exists key text;')
      console.log('   alter table api_keys alter column key_hash drop not null;')
      console.log('   ━'.repeat(40))
      console.log('\n   3. Depois volte e tente criar a API key novamente.\n')
      return false
    } else {
      console.log('❌ Erro:', error.message)
      console.log('   Código:', error.code)
      console.log('   Detalhes:', error.details)
      return false
    }
  }

  console.log('✅ MIGRATION APLICADA COM SUCESSO!')
  console.log('   O campo "key" existe na tabela api_keys.')
  console.log('\n🎉 Você já pode criar API keys no frontend!')
  console.log('   Acesse: http://localhost:5174/api-keys\n')
  return true
}

checkMigration()
