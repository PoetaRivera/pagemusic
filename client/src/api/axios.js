import axios from 'axios'
import { useAdminStore } from '../store/adminStore'

const api = axios.create({ baseURL: '/' })

api.interceptors.request.use(config => {
  const token = useAdminStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAdminStore.getState().logout()
      window.location.href = '/admin'
    }
    return Promise.reject(err)
  }
)

export default api
