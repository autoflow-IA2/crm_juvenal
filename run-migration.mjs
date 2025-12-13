import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ler variáveis de ambiente do arquivo .env
const envContent = readFileSync(join(__dirname, 'backend', '.env'), 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const SUPABASE_URL = env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Credenciais do Supabase não encontradas no backend/.env');
  process.exit(1);
}

console.log('🔌 Conectando ao Supabase...');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

console.log('📖 Lendo arquivo de migração...');
const migrationSQL = readFileSync(
  join(__dirname, 'supabase', 'migrations', '005_add_api_columns.sql'),
  'utf8'
);

console.log('🚀 Aplicando migração...\n');

// Dividir SQL em statements executáveis
const statements = [];
let currentStatement = '';
let inDo Block = false;

migrationSQL.split('\n').forEach(line => {
  const trimmed = line.trim();

  // Detectar início de bloco DO
  if (trimmed.startsWith('DO $$') || trimmed.startsWith('DO $')) {
    inDoBlock = true;
    currentStatement += line + '\n';
    return;
  }

  // Detectar fim de bloco DO
  if (inDoBlock && (trimmed === '$$;' || trimmed.startsWith('END $$'))) {
    currentStatement += line + '\n';
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    currentStatement = '';
    inDoBlock = false;
    return;
  }

  // Se estiver em bloco DO, acumular
  if (inDoBlock) {
    currentStatement += line + '\n';
    return;
  }

  // Pular comentários e linhas vazias
  if (!trimmed || trimmed.startsWith('--')) {
    return;
  }

  // Acumular linha atual
  currentStatement += line + '\n';

  // Se encontrar ponto e vírgula, finalizar statement
  if (trimmed.endsWith(';')) {
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    currentStatement = '';
  }
});

console.log(`📝 Total de statements: ${statements.length}\n`);

let successCount = 0;
let skipCount = 0;
let errorCount = 0;
const errors = [];

for (let i = 0; i < statements.length; i++) {
  const statement = statements[i];
  const preview = statement.substring(0, 100).replace(/\n/g, ' ').replace(/\s+/g, ' ');

  process.stdout.write(`[${String(i + 1).padStart(3)}/${statements.length}] ${preview}...`);

  try {
    const { data, error } = await supabase.rpc('query', { sql: statement });

    if (error) {
      // Verificar se é um erro esperado (objeto já existe)
      const expectedErrors = [
        'already exists',
        'duplicate',
        'does not exist'
      ];

      const isExpected = expectedErrors.some(msg =>
        error.message.toLowerCase().includes(msg.toLowerCase())
      );

      if (isExpected) {
        console.log(' ⚠️  Skip (já existe)');
        skipCount++;
      } else {
        console.log(` ❌ ${error.message.substring(0, 60)}`);
        errors.push({ index: i + 1, statement: preview, error: error.message });
        errorCount++;
      }
    } else {
      console.log(' ✅');
      successCount++;
    }
  } catch (err) {
    console.log(` ❌ ${err.message.substring(0, 60)}`);
    errors.push({ index: i + 1, statement: preview, error: err.message });
    errorCount++;
  }

  // Pequeno delay
  await new Promise(resolve => setTimeout(resolve, 50));
}

console.log('\n' + '='.repeat(80));
console.log('📊 RESUMO DA MIGRAÇÃO:');
console.log(`   ✅ Executados com sucesso: ${successCount}`);
console.log(`   ⚠️  Pulados (já existiam): ${skipCount}`);
console.log(`   ❌ Erros: ${errorCount}`);
console.log('='.repeat(80));

if (errors.length > 0 && errorCount > 5) {
  console.log('\n❌ MUITOS ERROS ENCONTRADOS!');
  console.log('\nPrimeiros 5 erros:');
  errors.slice(0, 5).forEach(err => {
    console.log(`\n[${err.index}] ${err.statement}`);
    console.log(`    Erro: ${err.error}`);
  });

  console.log('\n📝 RECOMENDAÇÃO: Aplicar migração manualmente');
  console.log('1. Acesse: https://supabase.com/dashboard');
  console.log('2. Vá em SQL Editor');
  console.log('3. Cole o conteúdo de: supabase/migrations/005_add_api_columns.sql');
  console.log('4. Execute');
} else if (errors.length > 0) {
  console.log('\n⚠️  Alguns erros foram encontrados:');
  errors.forEach(err => {
    console.log(`\n[${err.index}] ${err.statement}`);
    console.log(`    ${err.error}`);
  });
} else {
  console.log('\n🎉 Migração aplicada com 100% de sucesso!');
  console.log('\n✅ Próximo passo: Reiniciar o servidor backend');
  console.log('   cd backend && npm run dev');
}

console.log();
