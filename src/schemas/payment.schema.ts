import { z } from 'zod';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

export const createPaymentSchema = z.object({
  body: z.object({
    appointmentId: z.string().cuid(),
    patientId: z.string().cuid(),
    amount: z.number().min(0),
    discountAmount: z.number().min(0).optional().default(0),
    discountReason: z.string().max(255).optional(),
    taxAmount: z.number().min(0).optional().default(0),
    paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.CASH),
    notes: z.string().optional(),
  }),
});

export const confirmPaymentSchema = z.object({
  body: z.object({
    transactionId: z.string().min(3).max(100),
    referenceNumber: z.string().max(100).optional(),
    paidAmount: z.number().min(0).optional(),
    notes: z.string().optional(),
  }),
});

export const listPaymentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    status: z.nativeEnum(PaymentStatus).optional(),
    patientId: z.string().cuid().optional(),
    appointmentId: z.string().cuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>['body'];
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentSchema>['body'];
export type ListPaymentsQuery = z.infer<typeof listPaymentsSchema>['query'];
