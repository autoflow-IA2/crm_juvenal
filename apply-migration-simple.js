const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

async function applyMigration() {
  console.log('📖 Lendo migração...');
  const sql = fs.readFileSync(path.join(__dirname, 'supabase', 'migrations', '005_add_api_columns.sql'), 'utf8');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variáveis de ambiente não encontradas!');
    console.error('SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
    console.error('SUPABASE_SERVICE_KEY:', supabaseKey ? 'OK' : 'MISSING');
    process.exit(1);
  }

  // Extrair project ref da URL
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

  console.log('🚀 Aplicando migração...');
  console.log('📍 Projeto:', projectRef);
  console.log('');
  console.log('⚠️  Como o Supabase não tem um endpoint RPC público para exec_sql,');
  console.log('    você precisa aplicar a migração manualmente:');
  console.log('');
  console.log('📋 PASSOS:');
  console.log('');
  console.log('1. Abra o Supabase Dashboard:');
  console.log(`   https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  console.log('');
  console.log('2. Cole o conteúdo do arquivo migration');
  console.log(`   Arquivo: ${path.join(__dirname, 'supabase', 'migrations', '005_add_api_columns.sql')}`);
  console.log('');
  console.log('3. Clique em "Run" para executar');
  console.log('');
  console.log('='.repeat(70));
  console.log('');
  console.log('💡 ALTERNATIVA RÁPIDA - Copie o SQL abaixo:');
  console.log('');
  console.log('='.repeat(70));
  console.log(sql);
  console.log('='.repeat(70));
}

applyMigration().catch(console.error);
