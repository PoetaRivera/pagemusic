import api from './axios'

export const getAllArtists = () => api.get('/api/artists')
export const getArtistWithSongs = (name) => api.get(`/api/artists/${encodeURIComponent(name)}/songs`)
