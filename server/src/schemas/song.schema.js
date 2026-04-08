import { z } from 'zod'

export const songSchema = z.object({
  title: z.string().min(1, 'Título requerido'),
  artist: z.string().min(1, 'Artista requerido'),
  album: z.string().optional(),
  duration: z.number().int().positive().optional().nullable(),
  audio_url: z.string().url('URL de audio inválida'),
  cover_url: z.string().url('URL de cover inválida').optional().or(z.literal('')),
  genre_id: z.number().int().positive('Género requerido'),
})
