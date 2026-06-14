import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import userRepository from '../repositories/user.repository';
import { sendError } from '../utils/response';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Authentication required', 401);
    }

    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.id);

    if (!user || !user.isActive) {
      return sendError(res, 'User not found or inactive', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Invalid or expired token', 401);
  }
};
