import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validation.middleware';
import { 
  loginSchema, 
  refreshTokenSchema, 
  // forgotPasswordSchema, 
  // resetPasswordSchema 
} from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);
// router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
// router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

export default router;
