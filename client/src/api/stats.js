import api from './axios'

export const recordPlay = (data) => api.post('/api/stats/plays', data)
export const getStatsSummary = () => api.get('/api/stats/summary')
export const getTopSongs = (limit = 10) => api.get(`/api/stats/top-songs?limit=${limit}`)
export const getTopGenres = () => api.get('/api/stats/top-genres')
export const getByHour = () => api.get('/api/stats/by-hour')
export const getByWeekday = () => api.get('/api/stats/by-weekday')
export const getMostSkipped = (limit = 10) => api.get(`/api/stats/most-skipped?limit=${limit}`)
