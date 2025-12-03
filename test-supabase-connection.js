// Script para testar conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

console.log('╔════════════════════════════════════════════════════════════╗')
console.log('║       🔍 TESTE DE CONEXÃO COM SUPABASE - Juvenal CRM      ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

console.log('📡 URL:', supabaseUrl)
console.log('🔑 Key:', supabaseAnonKey.substring(0, 30) + '...\n')

const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Cliente Supabase criado com sucesso\n')

// Lista de tabelas para testar
const tables = [
  'clients',
  'appointments',
  'transactions',
  'session_packages',
  'client_session_packages',
  'working_hours',
  'blocked_slots',
  'user_settings',
  'service_types'
]

console.log('╔════════════════════════════════════════════════════════════╗')
console.log('║                  🗄️  TESTANDO TABELAS                      ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

let successCount = 0
let errorCount = 0

for (const table of tables) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.log(`❌ ${table.padEnd(30)} - ERRO: ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ ${table.padEnd(30)} - OK`)
      successCount++
    }
  } catch (err) {
    console.log(`❌ ${table.padEnd(30)} - ERRO: ${err.message}`)
    errorCount++
  }
}

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║                  🔐 TESTANDO AUTENTICAÇÃO                  ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

try {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.log('❌ Sistema de autenticação:', error.message)
  } else {
    console.log('✅ Sistema de autenticação: Funcionando')
    console.log('📊 Sessão atual:', data.session ? '🟢 Logado' : '⚪ Não logado (normal)')
  }
} catch (err) {
  console.log('❌ Erro ao verificar autenticação:', err.message)
}

console.log('\n╔════════════════════════════════════════════════════════════╗')
console.log('║                     📊 RESUMO FINAL                        ║')
console.log('╚════════════════════════════════════════════════════════════╝\n')

console.log(`✅ Tabelas funcionando: ${successCount}/9`)
console.log(`❌ Tabelas com erro: ${errorCount}/9`)

if (successCount === 9) {
  console.log('\n🎉 PERFEITO! Todas as migrations foram executadas com sucesso!')
  console.log('🚀 O sistema está 100% pronto para uso!')
  console.log('\n📍 Próximos passos:')
  console.log('   1. Acesse: http://localhost:5174/register')
  console.log('   2. Crie um usuário: admin@juvenalcrm.com / admin123')
  console.log('   3. Faça login e explore o sistema!')
} else if (successCount > 0) {
  console.log('\n⚠️  Algumas tabelas estão faltando!')
  console.log('📋 Verifique se todas as 3 migrations foram executadas:')
  console.log('   1. supabase/migrations/001_initial_schema.sql')
  console.log('   2. supabase/migrations/002_row_level_security.sql')
  console.log('   3. supabase/migrations/003_views_and_functions.sql')
} else {
  console.log('\n❌ Nenhuma tabela encontrada!')
  console.log('📋 Execute as migrations no Supabase SQL Editor:')
  console.log('   URL: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql')
  console.log('   Veja instruções em: QUICK_START.md ou SUPABASE_SETUP.md')
}

console.log('\n════════════════════════════════════════════════════════════\n')
