import { Pencil, Trash } from "lucide-react"

export default function CategoryCard({ category, onEdit, onDelete }) {

  return (
    <div className="border rounded-xl p-4 space-y-2">

      {category.image && (
        <img src={category.image} className="w-full h-20 object-cover rounded-lg" />
      )}

      <h3 className="font-semibold">{category.name}</h3>

      <p className="text-xs text-gray-500 line-clamp-2">
        {category.description || "No description"}
      </p>

      <div className="flex gap-2 pt-2">
        <button onClick={() => onEdit(category)} className="text-blue-600 hover:text-blue-800">
          <Pencil size={16}/>
        </button>
        <button onClick={() => onDelete(category._id)} className="text-red-500 hover:text-red-700">
          <Trash size={16}/>
        </button>
      </div>

    </div>
  )
}