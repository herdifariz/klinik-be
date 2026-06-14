import { z } from 'zod';
import { Gender, BloodType } from '@prisma/client';

export const createPatientSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      // Map birthDate from request to dateOfBirth if dateOfBirth is missing
      if (!val.dateOfBirth && val.birthDate) {
        val.dateOfBirth = val.birthDate;
      }
    }
    return val;
  }, z.object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    nik: z.string().length(16, 'NIK must be exactly 16 characters').regex(/^\d+$/, 'NIK must contain only numbers'),
    dateOfBirth: z.preprocess((val) => {
      if (!val) return undefined;
      const d = new Date(val as any);
      if (isNaN(d.getTime())) return undefined;
      return d;
    }, z.date({ invalid_type_error: 'Invalid date format', required_error: 'Date of birth is required' }).max(new Date(), 'Date of birth cannot be in the future')),
    gender: z.nativeEnum(Gender, { errorMap: () => ({ message: 'Gender is required (MALE, FEMALE, or OTHER)' }) }),
    phone: z.string().min(10, 'Phone must be at least 10 characters').max(20, 'Phone cannot exceed 20 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().optional().or(z.literal('')).transform(val => val || 'Unknown'),
    province: z.string().optional().or(z.literal('')).transform(val => val || 'Unknown'),
    postalCode: z.string().max(10).optional().or(z.literal('')),
    emergencyContactName: z.string().optional().or(z.literal('')).transform(val => val || 'Unknown'),
    emergencyContactPhone: z.string().optional().or(z.literal('')).transform(val => val || 'Unknown'),
    allergies: z.array(z.string()).optional(),
    bloodType: z.nativeEnum(BloodType).optional(),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
  })),
});

export const updatePatientSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      // Map birthDate from request to dateOfBirth if dateOfBirth is missing
      if (!val.dateOfBirth && val.birthDate) {
        val.dateOfBirth = val.birthDate;
      }
    }
    return val;
  }, z.object({
    fullName: z.string().min(2).optional(),
    email: z.string().email().optional().or(z.literal('')),
    nik: z.string().length(16, 'NIK must be exactly 16 characters').regex(/^\d+$/, 'NIK must contain only numbers').optional(),
    dateOfBirth: z.preprocess((val) => {
      if (!val) return undefined;
      const d = new Date(val as any);
      if (isNaN(d.getTime())) return undefined;
      return d;
    }, z.date({ invalid_type_error: 'Invalid date format' }).max(new Date(), 'Date of birth cannot be in the future').optional()),
    gender: z.nativeEnum(Gender).optional(),
    phone: z.string().min(10).max(20).optional(),
    address: z.string().min(5).optional(),
    city: z.string().optional().or(z.literal('')),
    province: z.string().optional().or(z.literal('')),
    postalCode: z.string().max(10).optional().or(z.literal('')),
    emergencyContactName: z.string().optional().or(z.literal('')),
    emergencyContactPhone: z.string().optional().or(z.literal('')),
    allergies: z.array(z.string()).optional(),
    bloodType: z.nativeEnum(BloodType).optional(),
    medicalHistory: z.string().optional(),
    notes: z.string().optional(),
  })),
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
