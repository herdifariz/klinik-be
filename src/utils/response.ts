import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  errors?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  pagination?: ApiResponse['pagination']
) => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    errors: null,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message = 'Error',
  statusCode = 500,
  errors: any = null
) => {
  const response: ApiResponse = {
    success: false,
    data: null,
    message,
    errors,
  };

  return res.status(statusCode).json(response);
};
