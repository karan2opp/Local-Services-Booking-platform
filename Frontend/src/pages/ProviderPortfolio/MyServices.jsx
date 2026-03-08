import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useProviderService from "../../customHooks/useProviderService"
import ProviderServiceCard from "./ProviderServiceCard"
import PopUp from "../../components/PopUp"

export default function MyServices() {

  const navigate = useNavigate()
  const { services, isLoading, error, fetchMyServices, deleteService } = useProviderService()
  const [popup, setPopup] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    fetchMyServices()
  }, [])
const handleEdit = (service) => {
  
  navigate("/serviceForm", { state: { service } })
}

  const handleDeleteConfirm = async () => {
    try {
      await deleteService(deleteId)
      setDeleteId(null)
      setPopup({ type: "success", message: "Service deleted successfully!" })
    } catch(err) {
      setDeleteId(null)
      setPopup({ type: "error", message: err.response?.data?.message || "Failed to delete" })
    }
  }

  if(isLoading) return <p className="text-gray-500 text-center">Loading...</p>
  if(error) return <p className="text-red-500 text-center">{error}</p>

  return (
    <>
      {popup && <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[320px] text-center space-y-4">
            <div className="text-4xl">🗑️</div>
            <h2 className="text-lg font-semibold">Delete Service?</h2>
            <p className="text-gray-500 text-sm">
              This action cannot be undone. Are you sure?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border rounded-lg py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">My Services</h2>
          <button
            onClick={() => navigate("/serviceForm")}  // ✅ fixed route
            className="text-blue-600 text-sm hover:underline"
          >
            + Create New Service
          </button>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-400 py-6">No services yet</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <ProviderServiceCard
                key={service._id}
                service={service}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        )}

      </div>
    </>
  )
}
