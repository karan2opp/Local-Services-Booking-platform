// customHooks/useProviderBooking.js
import axios from "axios"
import useProviderBookingStore from "../store/useProviderBookingStore"

const useProviderBooking = () => {

  const { bookings, isLoading, error, setBookings, setLoading, setError } = useProviderBookingStore()

  // ✅ fetch provider bookings with optional status filter
  const fetchProviderBookings = async (status = "") => {
    setLoading(true)
    try {
      const res = await axios.get("/api/booking/providerBookings", {
        params: { status },
        withCredentials: true
      })
      setBookings(res.data.data)
    } catch(err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ update booking status
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(
        `/api/booking/updateStatus/${bookingId}`,
        { status },
        { withCredentials: true }
      )
      // update in store without refetching
      useProviderBookingStore.setState((state) => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, status } : b
        )
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  return {
    bookings,
    isLoading,
    error,
    fetchProviderBookings,
    updateBookingStatus
  }
}

export default useProviderBooking