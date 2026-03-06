export default function ServiceCard({
  image,
  category,
  title,
  provider,
  rating,
  price
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden ">

      {/* Image */}
      <div className="h-40 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Category + Rating */}
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-blue-600 font-semibold uppercase">
            {category}
          </span>

          <span className="text-gray-600 flex items-center gap-1">
            ⭐ {rating}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-800 text-sm">
          {title}
        </h3>

        {/* Provider */}
        <p className="text-xs text-gray-500 mt-1">
          by {provider}
        </p>

        {/* Price */}
        <div className="flex justify-between items-center mt-4">

          <div>
            <p className="text-[10px] text-gray-400 uppercase">
              Starting At
            </p>

            <p className="text-blue-600 font-semibold">
              ${price}
            </p>
          </div>

          <button className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-md flex items-center justify-center">
            →
          </button>

        </div>

      </div>
    </div>
  );
}