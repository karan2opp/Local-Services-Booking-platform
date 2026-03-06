import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import BookingList from "./BookingList"
import useGetMyBookings from "../../customHooks/useBooking"
import useBookingStore from "../../store/useBookingStore"


export default function MyBookingPage() {

  const navigate = useNavigate()
  const { fetchMyBookings, cancelBooking } = useGetMyBookings()
  const { bookings, isLoading, error } = useBookingStore()

  useEffect(() => {
    fetchMyBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?")
    if(!confirm) return
    await cancelBooking(bookingId)
  }

  if(isLoading) return <p className="text-center mt-10">Loading...</p>
  if(error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
        >
          Home
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "pending", "confirmed", "inProgress", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => fetchMyBookings(status)}
            className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-400 capitalize"
          >
            {status || "All"}
          </button>
        ))}
      </div>

      <BookingList
        bookings={bookings}
        onCancel={handleCancel}
      />

    </div>
  )
}