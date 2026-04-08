import { z } from 'zod'

export const genreSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(100),
  description: z.string().optional(),
  cover_url: z.string().url('URL inválida').optional().or(z.literal('')),
})
