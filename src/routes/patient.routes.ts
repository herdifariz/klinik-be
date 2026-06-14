import { Router } from 'express';
import patientController from '../controllers/patient.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import {
  createPatientSchema,
  updatePatientSchema,
  listPatientsSchema
} from '../schemas/patient.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// All patient routes require authentication
router.use(authMiddleware);

// Staff only routes for creation and listing
router.post('/', authorize(UserRole.ADMIN, UserRole.STAFF), validate(createPatientSchema), patientController.createPatient);
router.get('/', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), validate(listPatientsSchema), patientController.listPatients);

// Common detail, update and delete
router.get('/:id', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), patientController.getPatientById);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.STAFF), validate(updatePatientSchema), patientController.updatePatient);
router.delete('/:id', authorize(UserRole.ADMIN), patientController.deletePatient);

export default router;
