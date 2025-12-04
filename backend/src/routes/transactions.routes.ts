import { Router } from 'express';
import { apiKeyAuth, requireScope } from '../middleware/apiKeyAuth';
import * as transactionsController from '../controllers/transactions.controller';

const router = Router();

router.get('/dashboard', apiKeyAuth, requireScope('read'), transactionsController.getDashboard);
router.get('/reports/monthly', apiKeyAuth, requireScope('read'), transactionsController.getMonthlyReport);
router.get('/pending', apiKeyAuth, requireScope('read'), transactionsController.getPendingTransactions);
router.get('/overdue', apiKeyAuth, requireScope('read'), transactionsController.getOverdueTransactions);
router.get('/', apiKeyAuth, requireScope('read'), transactionsController.listTransactions);
router.get('/:id', apiKeyAuth, requireScope('read'), transactionsController.getTransaction);
router.post('/', apiKeyAuth, requireScope('write'), transactionsController.createTransaction);
router.put('/:id', apiKeyAuth, requireScope('write'), transactionsController.updateTransaction);
router.patch('/:id', apiKeyAuth, requireScope('write'), transactionsController.updateTransaction);
router.patch('/:id/status', apiKeyAuth, requireScope('write'), transactionsController.updateTransactionStatus);
router.patch('/:id/pay', apiKeyAuth, requireScope('write'), transactionsController.payTransaction);
router.delete('/:id', apiKeyAuth, requireScope('delete'), transactionsController.deleteTransaction);

export default router;
