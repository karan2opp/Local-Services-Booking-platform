import { MapPin, Clock, Calendar } from "lucide-react"

export default function BookingRequestCard({ request, onAccept, onReject }) {

  const scheduledDate = new Date(request.scheduledDate)
  const date = scheduledDate.toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  })
  const time = scheduledDate.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit"
  })

  const statusColor = {
    confirmed:  "bg-blue-100 text-blue-600",
    inProgress: "bg-purple-100 text-purple-600",
    completed:  "bg-green-100 text-green-600",
    cancelled:  "bg-red-100 text-red-600"
  }

  return (
    <div className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm">

      <div className="flex items-center gap-4">

        {/* Customer avatar */}
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shrink-0">
          {request.customerId?.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="font-semibold">
            {request.serviceId?.serviceName}
          </h3>

          <p className="text-sm text-gray-500">
            {request.customerId?.username}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={14}/> {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14}/> {time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14}/>
              {request.address?.city}, {request.address?.area}
            </span>
          </div>
        </div>

      </div>

      {/* ✅ Actions — only for pending */}
      {request.status === "pending" ? (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onReject(request._id)}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
          >
            Reject
          </button>
          <button
            onClick={() => onAccept(request._id)}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      ) : (
        // ✅ status badge for all other statuses
        <span className={`px-3 py-1 text-xs rounded-full capitalize font-medium shrink-0 ${statusColor[request.status]}`}>
          {request.status}
        </span>
      )}

    </div>
  )
}