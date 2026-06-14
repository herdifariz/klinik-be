import { z } from 'zod';

export const listDoctorsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    specialization: z.string().optional(),
    isAvailable: z.coerce.boolean().optional(),
    search: z.string().optional(),
    sortBy: z.string().default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
  }),
});

export const availableSlotsSchema = z.object({
  params: z.object({
    id: z.string().cuid(),
  }),
  query: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  }),
});

export const createDoctorSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      // Map specialty to specialization if specialization is missing
      if (!val.specialization && val.specialty) {
        val.specialization = val.specialty;
      }
      // Auto-generate a licenseNumber if missing from frontend
      if (!val.licenseNumber) {
        val.licenseNumber = 'LIC-' + Math.random().toString(36).substring(2, 11).toUpperCase();
      }
    }
    return val;
  }, z.object({
    userId: z.string().cuid(),
    licenseNumber: z.string().min(5),
    specialization: z.string().min(2),
    experience: z.coerce.number().min(0).default(0),
    biography: z.string().optional().or(z.literal('')),
    consultationFee: z.coerce.number().min(0).default(0),
    workingDaysStart: z.string().optional(),
    workingDaysEnd: z.string().optional(),
    workingHoursStart: z.string().optional(),
    workingHoursEnd: z.string().optional(),
  })),
});

export const updateDoctorSchema = z.object({
  body: z.preprocess((val: any) => {
    if (val && typeof val === 'object') {
      // Map specialty to specialization if specialization is missing
      if (!val.specialization && val.specialty) {
        val.specialization = val.specialty;
      }
    }
    return val;
  }, z.object({
    specialization: z.string().min(2).optional(),
    experience: z.coerce.number().min(0).optional(),
    biography: z.string().optional().or(z.literal('')),
    consultationFee: z.coerce.number().min(0).optional(),
    isAvailable: z.boolean().optional(),
    workingDaysStart: z.string().optional(),
    workingDaysEnd: z.string().optional(),
    workingHoursStart: z.string().optional(),
    workingHoursEnd: z.string().optional(),
    breakTimeStart: z.string().optional(),
    breakTimeEnd: z.string().optional(),
    notes: z.string().optional(),
  })),
});

export type ListDoctorsQuery = z.infer<typeof listDoctorsSchema>['query'];
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>['body'];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>['body'];
