import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { sendSuccess } from '../utils/response';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    const { password, ...userWithoutPassword } = user;
    return sendSuccess(res, userWithoutPassword, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { users, pagination } = await userService.listUsers(req.query as any);
    const usersWithoutPasswords = users.map(({ password, ...u }) => u);
    return sendSuccess(res, usersWithoutPasswords, 'Users retrieved successfully', 200, pagination);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const requester = req.user!;

    if (requester.role !== 'ADMIN' && requester.id !== id) {
      const error: any = new Error('Forbidden - You can only access your own profile');
      error.statusCode = 403;
      throw error;
    }

    const user = await userService.getUserById(id);
    const { password, ...userWithoutPassword } = user;
    return sendSuccess(res, userWithoutPassword, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const requester = req.user!;

    if (requester.role !== 'ADMIN' && requester.id !== id) {
      const error: any = new Error('Forbidden - You can only update your own profile');
      error.statusCode = 403;
      throw error;
    }

    const user = await userService.updateUser(id, req.body);
    const { password, ...userWithoutPassword } = user;
    return sendSuccess(res, userWithoutPassword, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.deleteUser(req.params.id);
    return sendSuccess(res, { id: user.id, isActive: false, deactivatedAt: new Date() }, 'User deactivated successfully');
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const previousUser = await userService.getUserById(req.params.id);
    const user = await userService.changeRole(req.params.id, req.body);
    return sendSuccess(res, {
      id: user.id,
      role: user.role,
      previousRole: previousUser.role,
      changedAt: new Date(),
      reason: req.body.reason
    }, 'User role changed successfully');
  } catch (error) {
    next(error);
  }
};

// export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id } = req.params;
//     const requester = req.user!;

//     if (requester.role !== 'ADMIN' && requester.id !== id) {
//       const error: any = new Error('Forbidden - You can only change your own password');
//       error.statusCode = 403;
//       throw error;
//     }

//     const user = await userService.changePassword(id, req.body);
//     return sendSuccess(res, { id: user.id, changedAt: new Date() }, 'Password changed successfully');
//   } catch (error) {
//     next(error);
//   }
// };

export const userController = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  // changePassword,
};

export default userController;
