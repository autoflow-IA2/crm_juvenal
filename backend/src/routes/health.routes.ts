import { Router, Request, Response } from 'express';
import { sendSuccess } from '../utils/response';

const router = Router();

/**
 * GET /health
 * Health check endpoint (sem autenticação)
 */
router.get('/health', (req: Request, res: Response) => {
  sendSuccess(res, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

export default router;
