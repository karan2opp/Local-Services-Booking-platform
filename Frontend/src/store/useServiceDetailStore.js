// store/useServiceDetailStore.js
import { create } from "zustand"

const useServiceDetailStore = create((set) => ({
  service: null,
  isLoading: false,
  error: null,

  setService:(service) => set({ service }),
  setLoading:(isLoading) => set({ isLoading }),
  setError:(error) => set({ error })
}))

export default useServiceDetailStore