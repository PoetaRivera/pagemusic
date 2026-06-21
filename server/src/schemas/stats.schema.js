import { z } from 'zod'

export const playSchema = z.object({
  song_id: z.number().int().positive('song_id requerido'),
  duration_listened: z.number().min(0).max(24 * 60 * 60).optional().default(0),
  completed: z.boolean().optional().default(false),
  skipped: z.boolean().optional().default(false),
}).strict()
