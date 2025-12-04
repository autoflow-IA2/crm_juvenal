/**
 * Script para criar a primeira API Key manualmente
 * Útil para bootstrap do sistema
 *
 * Uso:
 * 1. Obtenha seu user_id do Supabase Dashboard
 * 2. Execute: npx ts-node scripts/create-first-api-key.ts <user_id>
 */

import 'dotenv/config';
import { supabaseAdmin } from '../src/config/supabase';
import { createApiKeyData } from '../src/utils/apiKey';

async function createFirstApiKey(userId: string, name: string = 'Initial Master Key') {
  try {
    console.log('🔐 Criando primeira API Key...\n');

    // Gerar API key
    const { key, hash, prefix } = createApiKeyData(false);

    // Inserir no banco
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .insert({
        user_id: userId,
        name: name,
        key_hash: hash,
        key_prefix: prefix,
        scopes: ['read', 'write', 'delete'],
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erro ao criar API key:', error);
      process.exit(1);
    }

    console.log('✅ API Key criada com sucesso!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  IMPORTANTE: Guarde esta key em local seguro!');
    console.log('⚠️  Ela será mostrada apenas UMA vez!\n');
    console.log('API Key:');
    console.log(key);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nDetalhes:');
    console.log(`  ID:        ${data.id}`);
    console.log(`  Nome:      ${data.name}`);
    console.log(`  Prefixo:   ${data.key_prefix}`);
    console.log(`  Scopes:    ${data.scopes.join(', ')}`);
    console.log(`  Criado em: ${data.created_at}`);
    console.log('\n💡 Teste agora:');
    console.log(`curl -H "X-API-Key: ${key}" http://localhost:3001/api/v1/health\n`);

  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
}

// Parse argumentos da linha de comando
const userId = process.argv[2];
const name = process.argv[3] || 'Initial Master Key';

if (!userId) {
  console.error('❌ Uso: npx ts-node scripts/create-first-api-key.ts <user_id> [name]');
  console.error('\n💡 Para obter seu user_id:');
  console.error('   1. Acesse Supabase Dashboard');
  console.error('   2. Vá em Authentication > Users');
  console.error('   3. Copie o ID do seu usuário\n');
  process.exit(1);
}

// Executar
createFirstApiKey(userId, name).then(() => {
  process.exit(0);
});
