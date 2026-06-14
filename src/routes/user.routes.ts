import { Router } from 'express';
import userController from '../controllers/user.controller';
import { validate } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorization.middleware';
import { 
  createUserSchema, 
  updateUserSchema, 
  changeRoleSchema, 
  changePasswordSchema,
  listUsersSchema
} from '../schemas/user.schema';
import { UserRole } from '@prisma/client';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

// Admin only routes
router.post('/', authorize(UserRole.ADMIN), validate(createUserSchema), userController.createUser);
router.get('/', authorize(UserRole.ADMIN), validate(listUsersSchema), userController.listUsers);
router.delete('/:id', authorize(UserRole.ADMIN), userController.deleteUser);
router.put('/:id/role', authorize(UserRole.ADMIN), validate(changeRoleSchema), userController.changeRole);

// Admin or Self routes
router.get('/:id', userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
// router.put('/:id/password', validate(changePasswordSchema), userController.changePassword);

export default router;
