import { Router } from 'express';
import { apiKeyAuth, requireScope } from '../middleware/apiKeyAuth';
import * as appointmentsController from '../controllers/appointments.controller';

const router = Router();

router.get('/stats', apiKeyAuth, requireScope('read'), appointmentsController.getAppointmentsStats);
router.get('/upcoming', apiKeyAuth, requireScope('read'), appointmentsController.getUpcomingAppointments);
router.get('/', apiKeyAuth, requireScope('read'), appointmentsController.listAppointments);
router.get('/:id', apiKeyAuth, requireScope('read'), appointmentsController.getAppointment);
router.post('/', apiKeyAuth, requireScope('write'), appointmentsController.createAppointment);
router.put('/:id', apiKeyAuth, requireScope('write'), appointmentsController.updateAppointment);
router.patch('/:id', apiKeyAuth, requireScope('write'), appointmentsController.updateAppointment);
router.patch('/:id/status', apiKeyAuth, requireScope('write'), appointmentsController.updateAppointmentStatus);
router.patch('/:id/payment', apiKeyAuth, requireScope('write'), appointmentsController.updateAppointmentPayment);
router.delete('/:id', apiKeyAuth, requireScope('delete'), appointmentsController.deleteAppointment);

export default router;
