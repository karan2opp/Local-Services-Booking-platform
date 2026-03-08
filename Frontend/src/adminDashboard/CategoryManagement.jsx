import { useEffect, useState } from "react"
import useAdminStore from "../store/useAdminStore"    // ✅
import useAdmin from "../customHooks/useAdmin" 
import CategoryCard from "./CategoryCard"
import PopUp from "../components/PopUp"
import { X } from "lucide-react"

export default function CategoryManagement() {

  const { fetchCategories, createCategory, updateCategory, deleteCategory } = useAdmin()
  const { categories, isLoading } = useAdminStore()
  const [popup, setPopup] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // ✅ form modal state
  const [showForm, setShowForm] = useState(false)
  const [editCategory, setEditCategory] = useState(null)  // null = create, object = edit
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditCategory(null)
    setFormData({ name: "", description: "" })
    setImage(null)
    setPreview(null)
    setShowForm(true)
  }

  const openEdit = (category) => {
    setEditCategory(category)
    setFormData({ name: category.name, description: category.description || "" })
    setPreview(category.image || null)
    setImage(null)
    setShowForm(true)
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if(file){
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if(!formData.name){
      setPopup({ type: "warning", message: "Category name is required" })
      return
    }
    setSubmitting(true)
    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      if(image) data.append("image", image)

      if(editCategory){
        await updateCategory(editCategory._id, data)
        setPopup({ type: "success", message: "Category updated!" })
      } else {
        await createCategory(data)
        setPopup({ type: "success", message: "Category created!" })
      }
      setShowForm(false)
    } catch(err) {
      setPopup({ type: "error", message: err.response?.data?.message || "Something went wrong" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deleteId)
      setDeleteId(null)
      setPopup({ type: "success", message: "Category deleted!" })
    } catch(err) {
      setDeleteId(null)
      setPopup({ type: "error", message: "Failed to delete" })
    }
  }

  return (
    <>
      {popup && <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      {/* ✅ Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] text-center space-y-4">
            <div className="text-4xl">🗑️</div>
            <h2 className="text-lg font-semibold">Delete Category?</h2>
            <p className="text-gray-500 text-sm">This will deactivate the category.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border rounded-lg py-2 text-sm">Cancel</button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] space-y-4">

            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{editCategory ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setShowForm(false)}><X size={18}/></button>
            </div>

            {/* Image */}
            <div
              onClick={() => document.getElementById("catImage").click()}
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            >
              {preview ? (
                <img src={preview} className="h-28 w-full object-cover rounded-lg" />
              ) : (
                <p className="text-sm text-gray-400">Click to upload image</p>
              )}
              <input id="catImage" type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Name *</label>
              <input type="text"
                className="border rounded-lg p-2 w-full mt-1 text-sm"
                placeholder="e.g. Cleaning"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="border rounded-lg p-2 w-full mt-1 text-sm resize-none"
                rows={2}
                placeholder="Short description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <button onClick={handleSubmit} disabled={submitting}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Saving..." : editCategory ? "Update Category" : "Create Category"}
            </button>

          </div>
        </div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between">
          <h2 className="font-semibold">Category Management</h2>
          <button onClick={openCreate}
            className="bg-blue-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-blue-700">
            + Add New Category
          </button>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No categories yet</p>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map((c) => (
              <CategoryCard
                key={c._id}
                category={c}
                onEdit={openEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}