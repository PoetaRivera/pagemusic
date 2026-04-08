import api from './axios'

export const loginAdmin = (data) => api.post('/api/admin/login', data)
export const verifyToken = () => api.get('/api/admin/verify')
