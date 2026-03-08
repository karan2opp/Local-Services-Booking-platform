import { CalendarCheck, Star } from "lucide-react"
import useProviderBookingStore from "../../store/useProviderBookingStore"

export default function StatsCards() {

  const { bookings } = useProviderBookingStore()
console.log(bookings);

  const activeBookings = bookings.filter(b =>
    ["pending", "confirmed", "inProgress"].includes(b.status)
  ).length

  const cards = [
    {
      title: "Active Bookings",
      value: activeBookings,
      sub: "Pending + Confirmed + InProgress",
      icon: <CalendarCheck className="text-blue-600" />,
      bg: "bg-blue-50"
    },
    {
      title: "Avg. Rating",
      value: "0",
      sub: "No reviews yet",
      icon: <Star className="text-yellow-500" />,
      bg: "bg-yellow-50"
    }
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {cards.map((s, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-5 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{s.title}</p>
            <h3 className="text-xl font-semibold">{s.value}</h3>
            <p className="text-xs text-gray-500">{s.sub}</p>
          </div>
          <div className={`${s.bg} p-3 rounded-lg`}>
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  )
}