import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PriceModal from "./PriceModal"
import useBooking from "../../customHooks/useBooking"

export default function BookingCard({ service }) {

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [bookingError, setBookingError] = useState("")

  const { createBooking, isLoading } = useBooking()
  const navigate = useNavigate()

  const taxes = service?.price * 0.14
  const total = service?.price + taxes

  const handleConfirmBooking = async () => {
    try {
      const scheduledDate = new Date(`${date}T${time}`)

      const bookingData = {
        serviceId: service._id,
        serviceProviderId: service.providerId?._id,
        scheduledDate,
        notes,
        ...(service.serviceType === "home" && {
          address: {
            street: "N/A",
            city: "N/A",
            area: "N/A",
            state: "N/A",
            pincode: "000000"
          }
        })
      }

      await createBooking(bookingData)
      setShowModal(false)
      navigate("/myBookings")

    } catch(err) {
      setBookingError(err.response?.data?.message || "Booking failed")
    }
  }

  return (
    <>
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-4 h-fit">

        <h3 className="font-semibold text-lg">Book Service</h3>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Price</span>
          <span className="text-blue-600 font-semibold">₹{service?.price}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-500">Type</span>
          <span className="capitalize">
            {service?.serviceType === "home" ? "🏠 Home Service" : "🏪 Store Visit"}
          </span>
        </div>

        <div>
          <p className="text-sm mb-1">Choose Date</p>
          <input
            type="date"
            className="border rounded-lg w-full p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm mb-1">Choose Time</p>
          <input
            type="time"
            className="border rounded-lg w-full p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div>
          <p className="text-sm mb-1">Notes (optional)</p>
          <textarea
            className="border rounded-lg w-full p-2 text-sm resize-none"
            rows={2}
            placeholder="Any special instructions..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ✅ show error if booking fails */}
        {bookingError && (
          <p className="text-red-500 text-sm">{bookingError}</p>
        )}

        <button
          onClick={() => setShowModal(true)}
          disabled={!date || !time}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          Book Now
        </button>

      </div>

      {showModal && (
        <PriceModal
          price={service?.price}
          tax={taxes}
          total={total}
          close={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}  // ✅ this was missing!
          isLoading={isLoading}             // ✅ this was missing!
        />
      )}
    </>
  )
}
