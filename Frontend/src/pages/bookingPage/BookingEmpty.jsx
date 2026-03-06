import { CalendarX } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function BookingEmpty() {

  const navigate = useNavigate()

  return (
    <div className="text-center py-20">

      <CalendarX size={40} className="mx-auto text-gray-400"/>

      <h2 className="text-xl font-semibold mt-4">
        No bookings yet
      </h2>

      <p className="text-gray-500 mt-1">
        Your booked services will appear here.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
      >
        Browse Services
      </button>

    </div>
  )
}