import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

export const useAdminStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAdmin: false,
      login: (token, username) => set({ token, username, isAdmin: true }),
      logout: () => set({ token: null, username: null, isAdmin: false }),
    }),
    {
      name: 'admin-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.logout()
        }
      },
    }
  )
)
