import { Router } from 'express';
import healthRoutes from './health.routes';
import apiKeysRoutes from './apiKeys.routes';
import clientsRoutes from './clients.routes';
import appointmentsRoutes from './appointments.routes';
import transactionsRoutes from './transactions.routes';

const router = Router();

/**
 * Montar todas as rotas da API
 * Base path: /api/v1
 */

// Health check (sem autenticação)
router.use(healthRoutes);

// API Keys management
router.use('/api-keys', apiKeysRoutes);

// Recursos principais
router.use('/clients', clientsRoutes);
router.use('/appointments', appointmentsRoutes);
router.use('/transactions', transactionsRoutes);

export default router;
