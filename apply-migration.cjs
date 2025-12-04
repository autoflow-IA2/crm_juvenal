const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const supabaseUrl = 'https://joeltxvtidnquzbzslkq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvZWx0eHZ0aWRucXV6YnpzbGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3Njc1OTEsImV4cCI6MjA4MDM0MzU5MX0.jVMX6GW26wSbgECkU0dnPv0ES7kMLDBsSJknDU0nzTs'

const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  console.log('📦 Aplicando migration 006...\n')

  const sql = fs.readFileSync('./supabase/migrations/006_add_key_field.sql', 'utf8')

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      console.error('❌ Erro:', error)
      console.log('\n⚠️  Use o SQL Editor do Supabase Dashboard para aplicar manualmente:')
      console.log('https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql\n')
      console.log('SQL:')
      console.log(sql)
    } else {
      console.log('✅ Migration aplicada com sucesso!')
    }
  } catch (err) {
    console.error('❌ Erro ao executar:', err.message)
    console.log('\n⚠️  Aplique manualmente no Supabase Dashboard:')
    console.log('https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql\n')
    console.log('Copie e cole este SQL:')
    console.log('─'.repeat(60))
    console.log(sql)
    console.log('─'.repeat(60))
  }
}

applyMigration()
