import { Router } from 'express';
import doctorController from '../controllers/doctor.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { 
  listDoctorsSchema, 
  availableSlotsSchema, 
  createDoctorSchema, 
  updateDoctorSchema 
} from '../schemas/doctor.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// Public routes (No auth required according to API docs)
router.get('/', validate(listDoctorsSchema), doctorController.listDoctors);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/available-slots', validate(availableSlotsSchema), doctorController.getAvailableSlots);

// Protected routes
router.use(authMiddleware);

// Admin only: create doctor profile
router.post('/', authorize(UserRole.ADMIN), validate(createDoctorSchema), doctorController.createDoctor);

// Admin or Doctor themselves: update profile
router.put('/:id', validate(updateDoctorSchema), doctorController.updateDoctor);

export default router;
