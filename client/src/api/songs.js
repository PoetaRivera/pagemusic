import api from './axios'

export const getAllSongs = () => api.get('/api/songs')

export const searchSongs = (query) => api.get(`/api/songs/search?q=${encodeURIComponent(query)}`)

export const patchSongDuration = (id, duration) => api.patch(`/api/songs/${id}/duration`, { duration })
