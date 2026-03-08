// store/useProviderBookingStore.js
import { create } from "zustand"

const useProviderBookingStore = create((set) => ({
  bookings: [],
  isLoading: false,
  error: null,

  setBookings: (bookings) => set({ bookings }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))

export default useProviderBookingStore