import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isProvider: false,
  isAdmin: false,  // ✅

  login: (userData) => set({
    user: userData,
    isLoggedIn: true,
    isAdmin: userData?.role === "admin"  // ✅
  }),

  logout: () => set({
    user: null,
    isLoggedIn: false,
    isProvider: false,
    isAdmin: false  // ✅
  }),

  setIsProvider: (value) => set({ isProvider: value })
}))

export default useAuthStore