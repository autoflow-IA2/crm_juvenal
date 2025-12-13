const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Ler .env manualmente
const envPath = path.join(__dirname, 'backend', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim();
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Credenciais não encontradas no backend/.env');
  process.exit(1);
}

console.log('🔌 Conectando ao Supabase...');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
});

console.log('📖 Lendo migração...\n');
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '005_add_api_columns.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Dividir em statements
const statements = [];
let currentStmt = '';
let inDoBlock = false;

migrationSQL.split('\n').forEach(line => {
  const trimmed = line.trim();

  // Detectar bloco DO
  if (trimmed.startsWith('DO $$') || trimmed.startsWith('DO $')) {
    inDoBlock = true;
  }

  // Se estiver em bloco DO
  if (inDoBlock) {
    currentStmt += line + '\n';
    if (trimmed === '$$;' || trimmed.startsWith('END $$')) {
      statements.push(currentStmt.trim());
      currentStmt = '';
      inDoBlock = false;
    }
    return;
  }

  // Pular comentários e vazias
  if (!trimmed || trimmed.startsWith('--')) return;

  currentStmt += line + '\n';

  // Finalizar no ;
  if (trimmed.endsWith(';')) {
    if (currentStmt.trim()) {
      statements.push(currentStmt.trim());
    }
    currentStmt = '';
  }
});

console.log(`📝 ${statements.length} statements encontrados\n`);

async function runMigration() {
  let success = 0;
  let warnings = 0;
  let errors = 0;

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const preview = stmt.substring(0, 80).replace(/\n/g, ' ').replace(/\s+/g, ' ');

    process.stdout.write(`[${String(i + 1).padStart(2, '0')}/${statements.length}] ${preview}...`);

    try {
      // Executar via from().insert() ou rpc()
      // Como não temos um RPC customizado, vamos usar uma abordagem diferente
      // Vamos tentar executar via SQL direto
      const { data, error } = await supabase.rpc('exec', { sql: stmt });

      if (error) {
        // Checar se é aviso (objeto já existe)
        const isWarning =
          error.message.includes('already exists') ||
          error.message.includes('does not exist') ||
          error.code === '42710' || // duplicate object
          error.code === '42701';   // duplicate column

        if (isWarning) {
          console.log(' ⚠️  (já existe)');
          warnings++;
        } else {
          console.log(`\n     ❌ ${error.message}\n`);
          errors++;
        }
      } else {
        console.log(' ✅');
        success++;
      }
    } catch (err) {
      console.log(`\n     ❌ ${err.message}\n`);
      errors++;
    }

    // Delay
    await new Promise(r => setTimeout(r, 50));
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESULTADO:');
  console.log(`   ✅ Sucesso: ${success}`);
  console.log(`   ⚠️  Avisos: ${warnings}`);
  console.log(`   ❌ Erros: ${errors}`);
  console.log('='.repeat(80));

  if (errors > statements.length / 2) {
    console.log('\n⚠️  Muitos erros! Provavelmente o Supabase não tem RPC exec().');
    console.log('\n📋 APLICAR MANUALMENTE:');
    console.log('1. https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql/new');
    console.log('2. Cole o conteúdo de: supabase/migrations/005_add_api_columns.sql');
    console.log('3. Execute');
  } else if (success > 0) {
    console.log('\n🎉 Migração aplicada! Reinicie o servidor backend.');
  }

  console.log();
}

runMigration().catch(err => {
  console.error('\n💥 ERRO:', err.message);
  console.log('\n📋 Aplique manualmente no dashboard:');
  console.log('https://supabase.com/dashboard/project/joeltxvtidnquzbzslkq/sql/new');
});
