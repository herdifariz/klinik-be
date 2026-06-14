import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate field value entered';
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    }
  }

  // Log error in development or if it's a 500
  if (process.env.NODE_ENV === 'development' || statusCode === 500) {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${message}`);
    if (statusCode === 500) {
       console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
