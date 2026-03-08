import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isProvider: false,
      isAdmin: false,

      login: (userData) => set({
        user: userData,
        isLoggedIn: true,
        isAdmin: userData?.role === "admin"
      }),

      logout: () => set({
        user: null,
        isLoggedIn: false,
        isProvider: false,
        isAdmin: false
      }),

      setIsProvider: (value) => set({ isProvider: value })
    }),
    {
      name: "auth-storage",  // ✅ localStorage key
    }
  )
)

export default useAuthStore