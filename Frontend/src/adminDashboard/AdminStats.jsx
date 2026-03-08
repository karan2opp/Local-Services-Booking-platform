import { useEffect } from "react"
import { Users, UserPlus, Layers } from "lucide-react"
import useAdmin from "../customHooks/useAdmin"
import useAdminStore from "../store/useAdminStore"

export default function AdminStats() {

  const { fetchPendingProviders, fetchCategories } = useAdmin()
  const { pendingProviders, categories } = useAdminStore()

  useEffect(() => {
    fetchPendingProviders()
    fetchCategories()
  }, [])

  const stats = [
    {
      title: "Pending Providers",
      value: pendingProviders.length,
      icon: <UserPlus size={20} />
    },
    {
      title: "Active Categories",
      value: categories.length,
      icon: <Layers size={20} />
    }
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-sm flex justify-between">
          <div>
            <p className="text-sm text-gray-500">{s.title}</p>
            <h3 className="text-xl font-bold">{s.value}</h3>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg">
            {s.icon}
          </div>
        </div>
      ))}
    </div>
  )
}