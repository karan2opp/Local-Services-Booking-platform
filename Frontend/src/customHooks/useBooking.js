// customHooks/useBooking.js
import axios from "../utils/axiosConfig.js"
import useBookingStore from "../store/useBookingStore"

const useBooking = () => {

  const { bookings, isLoading, error, setBookings, setLoading, setError } = useBookingStore()

  const fetchMyBookings = async (status = "") => {
    setLoading(true)
    try {
      const res = await axios.get("/api/booking/myBookings", {
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

  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(
        `/api/booking/cancelBooking/${bookingId}`,
        {},
        { withCredentials: true }
      )
      useBookingStore.setState((state) => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      alert(err.response?.data?.message || "Failed to cancel booking")
    }
  }

  const createBooking = async (bookingData) => {
    setLoading(true)
    try {
      const res = await axios.post(
        "/api/booking/createBooking",
        bookingData,
        { withCredentials: true }
      )
      return res.data.data
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBooking = async (bookingId, updatedData) => {
    setLoading(true)
    try {
      const res = await axios.patch(
        `/api/booking/updateBooking/${bookingId}`,
        updatedData,
        { withCredentials: true }
      )
      useBookingStore.setState((state) => ({
        bookings: state.bookings.map(b =>
          b._id === bookingId ? { ...b, ...res.data.data } : b
        )
      }))
      return res.data.data
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { 
    bookings, 
    isLoading, 
    error, 
    fetchMyBookings,
    cancelBooking,
    createBooking,
    updateBooking
  }
}

export default useBooking