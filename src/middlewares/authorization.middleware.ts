import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { UserRole } from '@prisma/client';

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Forbidden - Insufficient permissions', 403);
    }

    next();
  };
};
