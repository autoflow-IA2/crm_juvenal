import { Router } from 'express';
import agendamentosRoutes from './agendamentos.routes';
import clientesRoutes from './clientes.routes';

const router = Router();

/**
 * Rota de health check (sem autenticação)
 */
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    message: 'API está funcionando corretamente',
  });
});

/**
 * Rotas de agendamentos
 * Base: /api/agendamentos
 */
router.use('/agendamentos', agendamentosRoutes);

/**
 * Rotas de clientes
 * Base: /api/clientes
 */
router.use('/clientes', clientesRoutes);

export default router;
