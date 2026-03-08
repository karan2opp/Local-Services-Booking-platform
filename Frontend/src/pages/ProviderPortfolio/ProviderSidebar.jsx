import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Calendar,
  User
} from "lucide-react"

export default function ProviderSidebar() {

  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={18}/>, path: "/PartnerDashboard" },
    { name: "Booking Requests", icon: <Calendar size={18}/>, path: "/PartnerBookings" },
    { name: "Update Profile", icon: <User size={18}/>, path: "/UpdateProfile" }
  ]

  return (
    <aside className="w-60 bg-white border-r min-h-screen p-4">

      <nav className="space-y-1">
        {menu.map((item, i) => (
          <button
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm
            hover:bg-blue-50 hover:text-blue-600 transition
            ${location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-600"}
            `}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </nav>

    </aside>
  )
}