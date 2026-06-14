import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const createUserSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      return {
        ...val,
        fullName: val.fullName || val.name,
      };
    }
    return val;
  }, z.object({
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Min 8 characters'),
    fullName: z.string().min(2).max(255),
    role: z.nativeEnum(UserRole),
  })),
});

export const updateUserSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      return {
        ...val,
        fullName: val.fullName || val.name,
      };
    }
    return val;
  }, z.object({
    email: z.string().email('Invalid email format').toLowerCase().optional(),
    fullName: z.string().min(2).max(255).optional(),
    isActive: z.boolean().optional(),
  })),
});

export const changeRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(UserRole),
    reason: z.string().min(5).max(255),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password required'),
    newPassword: z.string().min(8, 'Min 8 characters'),
    confirmPassword: z.string().min(8, 'Min 8 characters'),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
});

export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.coerce.boolean().optional(),
    search: z.string().optional(),
    sortBy: z.string().default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangeRoleInput = z.infer<typeof changeRoleSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type ListUsersQuery = z.infer<typeof listUsersSchema>['query'];
