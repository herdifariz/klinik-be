import { Router } from 'express';
import prescriptionController from '../controllers/prescription.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { createPrescriptionSchema, listPrescriptionsSchema } from '../schemas/prescription.schema';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Only doctors can create prescriptions
router.post('/', authorize(UserRole.DOCTOR), validate(createPrescriptionSchema), prescriptionController.createPrescription);

// Other roles can view
router.get('/', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), validate(listPrescriptionsSchema), prescriptionController.listPrescriptions);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), prescriptionController.getPrescriptionById);

export default router;
