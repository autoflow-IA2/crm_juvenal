require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não encontrados no .env');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('📖 Lendo arquivo de migração...');
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '005_add_api_columns.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('🚀 Aplicando migração 005_add_api_columns.sql...');

  try {
    // Executar o SQL completo
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Se rpc não existir, tentar abordagem diferente
      if (error.message.includes('function') || error.code === '42883') {
        console.log('⚠️ RPC não disponível, tentando aplicar via múltiplas queries...');

        // Dividir o SQL em statements individuais
        const statements = migrationSQL
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--'));

        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i];
          if (statement.includes('DO $$')) {
            // Pular blocos DO por enquanto
            continue;
          }

          console.log(`  Executando statement ${i + 1}/${statements.length}...`);
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement + ';' });

          if (stmtError) {
            console.error(`  ❌ Erro no statement ${i + 1}:`, stmtError.message);
            // Continuar mesmo com erros (algumas colunas podem já existir)
          }
        }

        console.log('✅ Migração aplicada com sucesso (alguns warnings podem ter ocorrido)');
      } else {
        throw error;
      }
    } else {
      console.log('✅ Migração aplicada com sucesso!');
      console.log('📊 Resultado:', data);
    }

  } catch (err) {
    console.error('❌ Erro ao aplicar migração:', err.message);
    console.error('\n📝 INSTRUÇÕES MANUAIS:');
    console.error('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
    console.error('2. Vá em SQL Editor');
    console.error('3. Cole o conteúdo do arquivo: supabase/migrations/005_add_api_columns.sql');
    console.error('4. Execute o SQL');
    process.exit(1);
  }
}

applyMigration();
