import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { createPaymentSchema, confirmPaymentSchema, listPaymentsSchema } from '../schemas/payment.schema';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authMiddleware);

// List and Detail (Staff and Patient)
router.get('/', authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), validate(listPaymentsSchema), paymentController.listPayments);
router.get('/:id', authorize(UserRole.ADMIN, UserRole.STAFF, UserRole.DOCTOR), paymentController.getPaymentById);

// Billing actions (Staff only)
router.post('/', authorize(UserRole.ADMIN, UserRole.STAFF), validate(createPaymentSchema), paymentController.createPayment);
router.put('/:id/confirm', authorize(UserRole.ADMIN, UserRole.STAFF), validate(confirmPaymentSchema), paymentController.confirmPayment);

export default router;
