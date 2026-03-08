import { LayoutDashboard, Users } from "lucide-react"

export default function AdminSidebar({ activeTab, setActiveTab }) {

  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={18}/>, key: "overview" },
    { name: "User Management", icon: <Users size={18}/>, key: "users" },
  ]

  return (
    <aside className="w-64 bg-white border-r p-5">

      <div className="mb-8">
        <h2 className="text-lg font-bold text-blue-600">Admin</h2>
        <p className="text-xs text-gray-500">Local Service Co</p>
      </div>

      <nav className="space-y-1">
        {menu.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm
              hover:bg-blue-50 hover:text-blue-600 transition
              ${activeTab === item.key ? "bg-blue-50 text-blue-600" : "text-gray-600"}
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