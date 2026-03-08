import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  isLoggedIn: false,
  isProvider: false,  // ✅ add this

  login: (userData) => set({
    user: userData,
    isLoggedIn: true,
  }),

  logout: () => set({
    user: null,
    isLoggedIn: false,
    isProvider: false,  // ✅ reset on logout
  }),

  setIsProvider: (value) => set({ isProvider: value })  // ✅ setter
}))

export default useAuthStore