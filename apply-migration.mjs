import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: join(process.cwd(), 'backend', '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function applyMigration() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SUPABASE_URL ou SUPABASE_SERVICE_KEY não encontrados');
    console.log('📁 Procurando em:', join(process.cwd(), 'backend', '.env'));
    console.log('URL:', supabaseUrl);
    console.log('Key:', supabaseKey ? 'Definida' : 'Não definida');
    process.exit(1);
  }

  console.log('🔌 Conectando ao Supabase...');
  console.log('📍 URL:', supabaseUrl);

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  console.log('📖 Lendo arquivo de migração...');
  const migrationPath = join(__dirname, 'supabase', 'migrations', '005_add_api_columns.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf8');

  console.log('🚀 Aplicando migração via SQL statements individuais...\n');

  // Dividir em statements e filtrar
  const statements = migrationSQL
    .split(/;(?=\s*(?:--|CREATE|ALTER|UPDATE|INSERT|DELETE|DROP|COMMENT|DO))/gi)
    .map(s => s.trim())
    .filter(s => {
      // Remover comentários puros e linhas vazias
      if (!s || s.startsWith('--')) return false;
      // Manter apenas statements SQL válidos
      return s.match(/^(CREATE|ALTER|UPDATE|INSERT|DELETE|DROP|COMMENT|DO)/i);
    });

  console.log(`📝 Total de statements: ${statements.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i].trim();
    if (!statement) continue;

    // Mostrar preview do statement
    const preview = statement.substring(0, 80).replace(/\n/g, ' ');
    console.log(`[${i + 1}/${statements.length}] ${preview}...`);

    try {
      // Executar via query raw
      const { data, error } = await supabase.rpc('exec', {
        query: statement + ';'
      });

      if (error) {
        // Alguns erros são esperados (tipo já existe, coluna já existe, etc)
        const isExpectedError = error.message.includes('already exists') ||
                                error.message.includes('does not exist') ||
                                error.code === '42710' || // duplicate object
                                error.code === '42701';   // duplicate column

        if (isExpectedError) {
          console.log(`  ⚠️ Aviso (ignorado): ${error.message}\n`);
        } else {
          console.error(`  ❌ Erro: ${error.message}\n`);
          errors.push({ statement: preview, error: error.message });
          errorCount++;
        }
      } else {
        console.log(`  ✅ Sucesso\n`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Exceção: ${err.message}\n`);
      errors.push({ statement: preview, error: err.message });
      errorCount++;
    }

    // Pequeno delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO:');
  console.log(`   ✅ Sucesso: ${successCount}`);
  console.log(`   ❌ Erros: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n❌ ERROS ENCONTRADOS:');
    errors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. ${err.statement}`);
      console.log(`   ${err.error}`);
    });

    console.log('\n📝 RECOMENDAÇÃO:');
    console.log('Se os erros forem críticos, aplique a migração manualmente:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql');
    console.log('2. Cole o conteúdo de: supabase/migrations/005_add_api_columns.sql');
    console.log('3. Execute o SQL');
  } else {
    console.log('\n🎉 Migração aplicada com sucesso!');
  }
  console.log('='.repeat(60) + '\n');
}

applyMigration().catch(err => {
  console.error('\n💥 ERRO FATAL:', err);
  console.log('\n📝 INSTRUÇÕES MANUAIS:');
  console.log('Aplique a migração manualmente via Supabase Dashboard:');
  console.log('1. Acesse: https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql');
  console.log('2. Cole o conteúdo de: supabase/migrations/005_add_api_columns.sql');
  console.log('3. Execute o SQL');
  process.exit(1);
});
