import { z } from 'zod';

export const createMedicalRecordSchema = z.object({
  body: z.object({
    appointmentId: z.string().cuid(),
    patientId: z.string().cuid(),
    diagnosis: z.string().min(2),
    treatment: z.string().min(2),
    medications: z.array(z.string()).optional().default([]),
    investigations: z.string().optional(),
    followUpRequired: z.boolean().optional().default(false),
    followUpDate: z.coerce.date().optional(),
    notes: z.string().optional(),
    documentUrl: z.string().url().optional(),
  }),
});

export const listMedicalRecordsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    patientId: z.string().cuid().optional(),
    doctorId: z.string().cuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const updateMedicalRecordSchema = z.object({
  body: createMedicalRecordSchema.shape.body.partial().omit({ appointmentId: true, patientId: true }),
});

export type CreateMedicalRecordInput = z.infer<typeof createMedicalRecordSchema>['body'];
export type UpdateMedicalRecordInput = z.infer<typeof updateMedicalRecordSchema>['body'];
export type ListMedicalRecordsQuery = z.infer<typeof listMedicalRecordsSchema>['query'];
