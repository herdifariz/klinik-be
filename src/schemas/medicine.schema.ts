import { z } from 'zod';

export const createMedicineSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(50),
    name: z.string().min(2).max(255),
    genericName: z.string().max(255).optional(),
    category: z.string().min(2).max(100),
    description: z.string().optional(),
    dosage: z.string().min(1).max(100),
    form: z.string().min(2).max(50),
    manufacturer: z.string().min(2).max(255),
    stock: z.number().int().min(0).default(0),
    minStock: z.number().int().min(0).default(10),
    unitPrice: z.number().min(0),
    expiryDate: z.coerce.date().optional(),
    batchNumber: z.string().max(100).optional(),
    sideEffects: z.array(z.string()).optional(),
    contraindications: z.array(z.string()).optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

export const updateMedicineSchema = z.object({
  body: createMedicineSchema.shape.body.partial(),
});

export const listMedicinesSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    search: z.string().optional(),
    category: z.string().optional(),
    inStock: z.coerce.boolean().optional(),
    sortBy: z.string().default('name'),
    order: z.enum(['asc', 'desc']).default('asc'),
  }),
});

export type CreateMedicineInput = z.infer<typeof createMedicineSchema>['body'];
export type UpdateMedicineInput = z.infer<typeof updateMedicineSchema>['body'];
export type ListMedicinesQuery = z.infer<typeof listMedicinesSchema>['query'];
