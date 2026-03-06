import { create } from "zustand"

const useServiceStore = create((set) => ({

  services: [],
  isLoading: false,
  error: null,
  pagination:{
    totalServices: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  },

  setServices:(services) => set({ services }),
  
  // ✅ append new services to existing ones
  appendServices:(newServices) => set((state) => ({
    services: [...state.services, ...newServices]
  })),

  setLoading:(isLoading) => set({ isLoading }),
  setError:(error) => set({ error }),
  setPagination:(pagination) => set({ pagination })
}))

export default useServiceStore