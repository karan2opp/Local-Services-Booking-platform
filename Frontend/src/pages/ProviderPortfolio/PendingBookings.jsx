import useProviderBookingStore from "../../store/useProviderBookingStore"
import BookingItem from "./BookingItem"
import useProviderBooking from "../../customHooks/useProviderBooking"

export default function PendingBookings() {

  const { updateBookingStatus } = useProviderBooking()
  const { bookings, isLoading, error } = useProviderBookingStore()

  // ✅ filter pending on frontend, no extra API call
  const pendingBookings = bookings.filter(b => b.status === "pending")

  const handleAccept = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "confirmed")
    } catch(err) {
      console.log(err)
    }
  }

  const handleReject = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, "cancelled")
    } catch(err) {
      console.log(err)
    }
  }

  if(isLoading) return <p className="text-center text-gray-500">Loading...</p>
  if(error){console.log(error)
     return <p className="text-center text-red-500">{error}</p>}

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">Pending Bookings</h2>
        <span className="text-sm text-blue-600">
          {pendingBookings.length} New Requests  {/* ✅ use filtered length */}
        </span>
      </div>

      {pendingBookings.length === 0 ? (
        <p className="text-center text-gray-400 py-6">No pending bookings</p>
      ) : (
        <div className="space-y-4">
          {pendingBookings.map((booking) => (  // ✅ use filtered list
            <BookingItem
              key={booking._id}
              booking={booking}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

    </div>
  )
}
