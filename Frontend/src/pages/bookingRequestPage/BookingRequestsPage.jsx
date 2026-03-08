import { useEffect } from "react"
import Navbar from "../../components/Navbar"
import BookingRequestList from "./BookingRequestList"
import useProviderBooking from "../../customHooks/useProviderBooking"
import useProviderBookingStore from "../../store/useProviderBookingStore"

export default function BookingRequestsPage() {

  const { fetchProviderBookings, updateBookingStatus } = useProviderBooking()
  const { bookings, isLoading, error } = useProviderBookingStore()


  useEffect(() => {
    fetchProviderBookings()  // ✅ no status filter = fetch all
  }, [])

  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "confirmed")
    } catch(err) {
      console.error(err)
    }
  }

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "cancelled")
    } catch(err) {
      console.error(err)
    }
  }

  if(isLoading) return (
    <>
      <Navbar />
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    </>
  )

  if(error) return (
    <>
      <Navbar />
      <p className="text-center mt-10 text-red-500">{error}</p>
    </>
  )

  return (
    <div className="p-6 space-y-6">
      <Navbar />
      <h1 className="text-2xl font-bold">Booking Requests</h1>
      <BookingRequestList
        requests={bookings}
        onAccept={handleAccept}
        onReject={handleReject}
      />
    </div>
  )
}