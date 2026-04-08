import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAdminStore = create(
  persist(
    (set) => ({
      token: null,
      username: null,
      isAdmin: false,
      login: (token, username) => set({ token, username, isAdmin: true }),
      logout: () => set({ token: null, username: null, isAdmin: false }),
    }),
    { name: 'admin-storage' }
  )
)
