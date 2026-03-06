import { useNavigate } from "react-router-dom"

export default function ServiceCard({ 
  _id,           // ✅ add this
  providerId,
  categoryId,
  serviceName,
  price,
  image,
  description
}) {
  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/service/${_id}`)}  // ✅ navigate on click
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"  // ✅ cursor-pointer
    >

      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={Array.isArray(image) ? image[0] : image}
          alt={serviceName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Category + Rating */}
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-blue-600 font-semibold uppercase">
            {categoryId?.name}
          </span>
          <span className="text-gray-600 flex items-center gap-1">
            ⭐ {providerId?.rating || "New"}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm">
          {serviceName}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>

        {/* Provider */}
        <p className="text-xs text-gray-400 mt-1">
          by {providerId?.userId?.username}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase">
              Starting At
            </p>
            <p className="text-blue-600 font-semibold">
              ₹{price}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation()  // ✅ prevent double navigation
              navigate(`/service/${_id}`)
            }}
            className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-md flex items-center justify-center"
          >
            →
          </button>
        </div>

      </div>
    </div>
  )
}