import { Request, Response } from 'express';
import { TransactionsService } from '../services/transactions.service';
import {
  createTransactionSchema,
  updateTransactionSchema,
  listTransactionsQuerySchema,
  updateStatusSchema,
  payTransactionSchema,
  dashboardQuerySchema,
  monthlyReportQuerySchema
} from '../validators/transactions.validator';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const query = listTransactionsQuerySchema.parse(req.query);
  const service = new TransactionsService(req.userId!);
  const result = await service.list(query);
  sendSuccess(res, result.data, result.pagination);
});

export const getTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = new TransactionsService(req.userId!);
  const transaction = await service.getById(id);
  sendSuccess(res, transaction);
});

export const getPendingTransactions = asyncHandler(async (req: Request, res: Response) => {
  const service = new TransactionsService(req.userId!);
  const transactions = await service.getPending();
  sendSuccess(res, transactions);
});

export const getOverdueTransactions = asyncHandler(async (req: Request, res: Response) => {
  const service = new TransactionsService(req.userId!);
  const transactions = await service.getOverdue();
  sendSuccess(res, transactions);
});

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const input = createTransactionSchema.parse(req.body);
  const service = new TransactionsService(req.userId!);
  const transaction = await service.create(input);
  sendSuccess(res, transaction, undefined, 201);
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = updateTransactionSchema.parse(req.body);
  const service = new TransactionsService(req.userId!);
  const transaction = await service.update(id, input);
  sendSuccess(res, transaction);
});

export const updateTransactionStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = updateStatusSchema.parse(req.body);
  const service = new TransactionsService(req.userId!);
  const transaction = await service.updateStatus(id, status);
  sendSuccess(res, transaction);
});

export const payTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { payment_method, paid_at } = payTransactionSchema.parse(req.body);
  const service = new TransactionsService(req.userId!);
  const transaction = await service.markAsPaid(id, payment_method, paid_at);
  sendSuccess(res, transaction);
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const service = new TransactionsService(req.userId!);
  await service.delete(id);
  sendSuccess(res, { message: 'Transação deletada com sucesso', id });
});

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const { date_from, date_to } = dashboardQuerySchema.parse(req.query);
  const service = new TransactionsService(req.userId!);
  const dashboard = await service.getDashboard(date_from, date_to);
  sendSuccess(res, dashboard);
});

export const getMonthlyReport = asyncHandler(async (req: Request, res: Response) => {
  const { year, month } = monthlyReportQuerySchema.parse(req.query);
  const service = new TransactionsService(req.userId!);
  const report = await service.getMonthlyReport(year, month);
  sendSuccess(res, report);
});
