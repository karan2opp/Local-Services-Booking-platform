// store/useAdminStore.js
import { create } from "zustand"

const useAdminStore = create((set) => ({
  pendingProviders: [],
  approvedProviders: [],
  rejectedProviders: [],
  categories: [],
  isLoading: false,
  error: null,

  setPendingProviders: (data) => set({ pendingProviders: data }),
  setApprovedProviders: (data) => set({ approvedProviders: data }),
  setRejectedProviders: (data) => set({ rejectedProviders: data }),
  setCategories: (data) => set({ categories: data }),
  setLoading: (val) => set({ isLoading: val }),
  setError: (val) => set({ error: val }),
}))

export default useAdminStore;