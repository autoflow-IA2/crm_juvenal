import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import routes from './routes';
import { authenticateApiKey } from './middlewares/auth.middleware';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';
import { initSupabase } from './config/supabase.config';

// Carregar variáveis de ambiente
dotenv.config();

// Criar aplicação Express
const app: Application = express();

// Porta do servidor
const PORT = Number(process.env.PORT) || 3001;

// Configurar CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
app.use(cors({
  origin: (origin, callback) => {
    // Permitir requisições sem origin (como Postman, curl, n8n)
    if (!origin) return callback(null, true);

    // Permitir todas as origens se configurado com '*'
    if (allowedOrigins.includes('*')) return callback(null, true);

    // Verificar se a origem está na lista permitida
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true,
}));

// Middlewares de segurança e logging
app.use(helmet()); // Segurança HTTP headers
app.use(morgan('combined')); // Logging de requisições
app.use(express.json()); // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded body

// Rota pública de health check (sem autenticação)
app.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Juvenal CRM API',
      version: '1.0.0',
      description: 'API REST para integração com ferramentas externas',
      documentation: '/api/health',
    },
    message: 'API está online',
  });
});

// Middleware de autenticação (aplica a todas as rotas /api/*)
app.use('/api', authenticateApiKey);

// Rotas da API
app.use('/api', routes);

// Handler de rotas não encontradas
app.use(notFoundHandler);

// Handler global de erros (deve ser o último middleware)
app.use(errorHandler);

// Inicializar servidor
const startServer = async () => {
  try {
    // Inicializar conexão com Supabase
    console.log('');
    console.log('🔌 Conectando ao Supabase...');
    initSupabase();

    // Iniciar servidor HTTP
    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🚀 ====================================== 🚀');
      console.log(`   Juvenal CRM API - v1.0.0`);
      console.log('🚀 ====================================== 🚀');
      console.log('');
      console.log(`📡 Servidor rodando em http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔐 CORS: ${allowedOrigins.join(', ')}`);
      console.log('');
      console.log('📚 Endpoints disponíveis:');
      console.log('');
      console.log('   🏥 Health:');
      console.log('   GET    /api/health');
      console.log('');
      console.log('   📅 Agendamentos:');
      console.log('   GET    /api/agendamentos              - Listar (com filtros)');
      console.log('   GET    /api/agendamentos/hoje         - Agendamentos de hoje');
      console.log('   GET    /api/agendamentos/proximos     - Próximos agendamentos');
      console.log('   GET    /api/agendamentos/stats        - Estatísticas');
      console.log('   GET    /api/agendamentos/:id          - Buscar por ID');
      console.log('   POST   /api/agendamentos              - Criar');
      console.log('   PATCH  /api/agendamentos/:id          - Atualizar');
      console.log('   PATCH  /api/agendamentos/:id/status   - Atualizar status');
      console.log('   PATCH  /api/agendamentos/:id/payment  - Atualizar pagamento');
      console.log('   DELETE /api/agendamentos/:id          - Deletar');
      console.log('   POST   /api/agendamentos/verificar-disponibilidade');
      console.log('   POST   /api/agendamentos/finalizar-passados');
      console.log('');
      console.log('🔑 Autenticação: X-API-Key header obrigatório');
      console.log('');
      console.log('⏳ Aguardando requisições...');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;
