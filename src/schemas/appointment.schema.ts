import { z } from 'zod';
import { AppointmentStatus } from '@prisma/client';

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string().cuid(),
    patientId: z.string().cuid().optional(), // If authenticated as patient, this is taken from their profile
    appointmentDateTime: z.coerce.date().min(new Date(), 'Appointment must be in the future'),
    reason: z.string().min(5),
    notes: z.string().optional(),
  }),
});

export const listAppointmentsSchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    status: z.nativeEnum(AppointmentStatus).optional(),
    doctorId: z.string().cuid().optional(),
    patientId: z.string().cuid().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }),
});

export const rescheduleAppointmentSchema = z.object({
  body: z.object({
    newAppointmentDateTime: z.coerce.date().min(new Date(), 'New appointment date must be in the future'),
    reason: z.string().optional(),
  }),
});

export const cancelAppointmentSchema = z.object({
  body: z.object({
    reason: z.string().min(3),
  }),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>['body'];
export type ListAppointmentsQuery = z.infer<typeof listAppointmentsSchema>['query'];
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>['body'];
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>['body'];
