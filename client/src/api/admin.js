import api from './axios'

export const createGenre = (data) => api.post('/api/genres', data)
export const updateGenre = (id, data) => api.put(`/api/genres/${id}`, data)
export const deleteGenre = (id) => api.delete(`/api/genres/${id}`)

export const createSong = (data) => api.post('/api/songs', data)
export const updateSong = (id, data) => api.put(`/api/songs/${id}`, data)
export const deleteSong = (id) => api.delete(`/api/songs/${id}`)

export const uploadAudio = (file, genreName) => {
  const form = new FormData()
  form.append('audio', file)
  return api.post(`/api/admin/upload?genre=${encodeURIComponent(genreName)}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
