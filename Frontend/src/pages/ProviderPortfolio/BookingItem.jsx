import { Calendar, Clock } from "lucide-react"

export default function BookingItem({ booking, onAccept, onReject }) {

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
    <div className="flex items-center justify-between gap-4 border-b pb-4 last:border-0 last:pb-0">

      {/* Customer Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm shrink-0">
          {booking.customerId?.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-medium text-sm">
            {booking.customerId?.username}
          </p>
          <p className="text-xs text-gray-500">
            {booking.serviceId?.serviceName}
          </p>
          <div className="flex gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12}/> {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12}/> {time}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onAccept(booking._id)}
          className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-lg hover:bg-green-200"
        >
          Accept
        </button>
        <button
          onClick={() => onReject(booking._id)}
          className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-lg hover:bg-red-200"
        >
          Reject
        </button>
      </div>

    </div>
  )
}