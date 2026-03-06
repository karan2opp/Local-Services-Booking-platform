import { Calendar, Clock, MapPin } from "lucide-react"

export default function BookingCard({ booking, onCancel }) {

  const statusColor = {
    pending:    "bg-yellow-100 text-yellow-600",
    confirmed:  "bg-blue-100 text-blue-600",
    inProgress: "bg-purple-100 text-purple-600",
    completed:  "bg-green-100 text-green-600",
    cancelled:  "bg-red-100 text-red-600"
  }

  const scheduledDate = new Date(booking.scheduledDate)
  const date = scheduledDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })
  const time = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  })

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col md:flex-row gap-4 shadow-sm">

      {/* Image */}
      <img
        src={Array.isArray(booking.serviceId?.image) 
          ? booking.serviceId?.image[0] 
          : booking.serviceId?.image}
        alt={booking.serviceId?.serviceName}
        className="w-full md:w-40 h-28 object-cover rounded-lg"
      />

      {/* Info */}
      <div className="flex-1 space-y-2">

        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">
            {booking.serviceId?.serviceName}
          </h3>
          <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColor[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <p className="text-sm text-gray-500">
          by {booking.serviceProviderId?.userId?.username}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">

          <div className="flex items-center gap-1">
            <Calendar size={16}/>
            {date}
          </div>

          <div className="flex items-center gap-1">
            <Clock size={16}/>
            {time}
          </div>

          <div className="flex items-center gap-1">
            <MapPin size={16}/>
            {booking.address?.city}, {booking.address?.area}
          </div>

        </div>

        {/* Notes */}
        {booking.notes && (
          <p className="text-xs text-gray-400 mt-1">
            📝 {booking.notes}
          </p>
        )}

      </div>

      {/* Actions */}
      <div className="flex flex-col justify-between items-end">

        <p className="font-semibold text-lg text-blue-600">
          ₹{booking.price}
        </p>

        {(booking.status === "pending" || booking.status === "confirmed") && (
          <button
            onClick={() => onCancel(booking._id)}
            className="text-sm text-red-500 hover:underline"
          >
            Cancel Booking
          </button>
        )}

      </div>

    </div>
  )
}