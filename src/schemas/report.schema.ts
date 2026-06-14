import { z } from 'zod';

export const reportQuerySchema = z.object({
  query: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    groupBy: z.string().optional(),
  }),
});

export type ReportQueryInput = z.infer<typeof reportQuerySchema>['query'];
