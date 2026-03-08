import { Pencil, Trash2 } from "lucide-react"

export default function ProviderServiceCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">

      {/* Image */}
      <div className="h-36 w-full overflow-hidden relative">
        <img
          src={Array.isArray(service.image) ? service.image[0] : service.image}
          alt={service.serviceName}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-2 left-2 bg-white text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
          {service.categoryId?.name}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">

        <h3 className="font-semibold text-gray-800 text-sm">
          {service.serviceName}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2">
          {service.description}
        </p>

        <div className="flex justify-between items-center pt-2">
          <p className="text-blue-600 font-semibold text-sm">
            ₹{service.price}
          </p>
          <span className="text-xs text-gray-400 capitalize">
            {service.serviceType === "home" ? "🏠 Home" : "🏪 Store"}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onEdit(service)}
            className="flex-1 flex items-center justify-center gap-1 border border-blue-500 text-blue-600 text-xs py-1.5 rounded-lg hover:bg-blue-50"
          >
            <Pencil size={12}/> Edit
          </button>
          <button
            onClick={() => onDelete(service._id)}
            className="flex-1 flex items-center justify-center gap-1 border border-red-400 text-red-500 text-xs py-1.5 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={12}/> Delete
          </button>
        </div>

      </div>
    </div>
  )
}