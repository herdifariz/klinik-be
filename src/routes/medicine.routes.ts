import { Router } from 'express';
import medicineController from '../controllers/medicine.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { createMedicineSchema, updateMedicineSchema, listMedicinesSchema } from '../schemas/medicine.schema';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// Publicly viewable by all staff/users (authenticated)
router.get('/', validate(listMedicinesSchema), medicineController.listMedicines);
router.get('/:id', medicineController.getMedicineById);

// Restricted to Admin and Reception (Inventory management)
router.post('/', authorize(UserRole.ADMIN, UserRole.STAFF), validate(createMedicineSchema), medicineController.createMedicine);
router.put('/:id', authorize(UserRole.ADMIN, UserRole.STAFF), validate(updateMedicineSchema), medicineController.updateMedicine);

export default router;
