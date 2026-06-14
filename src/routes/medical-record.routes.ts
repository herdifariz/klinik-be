import { Router } from 'express';
import medicalRecordController from '../controllers/medical-record.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { createMedicalRecordSchema, listMedicalRecordsSchema, updateMedicalRecordSchema } from '../schemas/medical-record.schema';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Creation and Update restricted to clinical staff
router.post('/', authorize(UserRole.ADMIN, UserRole.DOCTOR), validate(createMedicalRecordSchema), medicalRecordController.createMedicalRecord);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.DOCTOR), validate(updateMedicalRecordSchema), medicalRecordController.updateMedicalRecord);

// Listing and Detail
// Patients can view their own via service logic (usually handled by list filters)
router.get('/', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), validate(listMedicalRecordsSchema), medicalRecordController.listMedicalRecords);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.DOCTOR, UserRole.STAFF), medicalRecordController.getMedicalRecordById);

export default router;
