import api from './axios'

export const getAllGenres = () => api.get('/api/genres')
export const getGenreById = (id) => api.get(`/api/genres/${id}`)
export const getGenreWithSongs = (id) => api.get(`/api/genres/${id}/songs`)
