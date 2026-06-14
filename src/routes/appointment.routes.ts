import { Router } from 'express';
import appointmentController from '../controllers/appointment.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import {
  createAppointmentSchema,
  listAppointmentsSchema,
  rescheduleAppointmentSchema,
  cancelAppointmentSchema
} from '../schemas/appointment.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// All appointment routes require authentication
router.use(authMiddleware);

// Staff only: Create/Get own
router.post('/', validate(createAppointmentSchema), appointmentController.createAppointment);
router.get('/my-appointments', appointmentController.getMyAppointments);

// Staff only: List all
router.get('/', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), validate(listAppointmentsSchema), appointmentController.listAppointments);

// Update/Cancel
router.put('/:id/reschedule', validate(rescheduleAppointmentSchema), appointmentController.rescheduleAppointment);
router.delete('/:id/cancel', validate(cancelAppointmentSchema), appointmentController.cancelAppointment);

export default router;
