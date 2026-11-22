import { z } from 'zod';

export const createHolidaySchema = z.object({
  date: z.iso.date(), // "2026-12-25"
  name: z.string().trim().min(1).max(150),
});

export type CreateHoliday = z.infer<typeof createHolidaySchema>;

export const createHolidaysSchema = z.object({
  items: z.array(createHolidaySchema).min(1).max(100),
});

export type CreateHolidays = z.infer<typeof createHolidaysSchema>;

export const listHolidaysQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100).optional(),
});

export type ListHolidaysQuery = z.infer<typeof listHolidaysQuerySchema>;

export const holidaySchema = z.object({
  id: z.string(),
  date: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

export type Holiday = z.infer<typeof holidaySchema>;

export const createHolidaysResultSchema = z.object({
  created: z.number().int(),
  skipped: z.number().int(), // déjà existants
});

export type CreateHolidaysResult = z.infer<typeof createHolidaysResultSchema>;