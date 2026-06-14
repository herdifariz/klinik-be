import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(8, 'Min 8 characters'),
    fullName: z.string().min(2).max(255),
    role: z.enum(['PATIENT', 'DOCTOR']),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').toLowerCase(),
    password: z.string().min(1, 'Password required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token required'),
  }),
});

// export const forgotPasswordSchema = z.object({
//   body: z.object({
//     email: z.string().email('Invalid email format').toLowerCase(),
//   }),
// });

// export const resetPasswordSchema = z.object({
//   params: z.object({
//     token: z.string().min(1, 'Token required'),
//   }),
//   body: z.object({
//     newPassword: z.string().min(8, 'Min 8 characters'),
//     confirmPassword: z.string().min(8, 'Min 8 characters'),
//   }).refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords don't match",
//     path: ["confirmPassword"],
//   }),
// });

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
// export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
// export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
