import { z } from 'zod';

export const createPrescriptionSchema = z.object({
  body: z.object({
    appointmentId: z.string().cuid(),
    patientId: z.string().cuid(),
    notes: z.string().optional(),
    validityDays: z.number().int().min(1).default(30),
    items: z.array(z.object({
      medicineId: z.string().cuid(),
      dosage: z.string().min(1),
      frequency: z.string().min(1),
      duration: z.string().min(1),
      quantity: z.number().int().min(1),
      instructions: z.string().optional(),
    })).min(1, 'At least one medicine is required'),
  }),
});

export const listPrescriptionsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    patientId: z.string().cuid().optional(),
    doctorId: z.string().cuid().optional(),
    status: z.enum(['active', 'completed', 'cancelled']).optional(),
  }),
});

export type CreatePrescriptionInput = z.infer<typeof createPrescriptionSchema>['body'];
export type ListPrescriptionsQuery = z.infer<typeof listPrescriptionsSchema>['query'];
