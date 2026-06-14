import { z } from 'zod';
import { Gender, BloodType } from '@prisma/client';

export const createPatientSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    nik: z.string().length(16, 'NIK must be exactly 16 characters').regex(/^\d+$/, 'NIK must contain only numbers'),
    dateOfBirth: z.coerce.date().max(new Date(), 'Date of birth cannot be in the future'),
    gender: z.nativeEnum(Gender),
    phone: z.string().min(10).max(20),
    address: z.string().min(5),
    city: z.string().min(2),
    province: z.string().min(2),
    postalCode: z.string().max(10).optional(),
    emergencyContactName: z.string().min(2),
    emergencyContactPhone: z.string().min(10),
    allergies: z.array(z.string()).optional(),
    bloodType: z.nativeEnum(BloodType).optional(),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updatePatientSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional().or(z.literal('')),
    nik: z.string().length(16, 'NIK must be exactly 16 characters').regex(/^\d+$/, 'NIK must contain only numbers').optional(),
    dateOfBirth: z.coerce.date().max(new Date()).optional(),
    gender: z.nativeEnum(Gender).optional(),
    phone: z.string().min(10).max(20).optional(),
    address: z.string().min(5).optional(),
    city: z.string().min(2).optional(),
    province: z.string().min(2).optional(),
    postalCode: z.string().max(10).optional(),
    emergencyContactName: z.string().min(2).optional(),
    emergencyContactPhone: z.string().min(10).optional(),
    allergies: z.array(z.string()).optional(),
    bloodType: z.nativeEnum(BloodType).optional(),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const listPatientsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    city: z.string().optional(),
    sortBy: z.string().default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>['body'];
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>['body'];
export type ListPatientsQuery = z.infer<typeof listPatientsSchema>['query'];
