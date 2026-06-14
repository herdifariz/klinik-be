import { Router } from 'express';
import reportController from '../controllers/report.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { reportQuerySchema } from '../schemas/report.schema';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Revenue reports - Admin only
router.get('/revenue', authorize(UserRole.ADMIN), validate(reportQuerySchema), reportController.getRevenueReport);

// Appointment stats - Admin and Doctors
router.get('/appointments', authorize(UserRole.ADMIN, UserRole.DOCTOR), validate(reportQuerySchema), reportController.getAppointmentReport);

// Patient stats - Admin only
router.get('/patients', authorize(UserRole.ADMIN), validate(reportQuerySchema), reportController.getPatientReport);

export default router;
