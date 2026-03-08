import { useEffect, useState } from "react"


import PopUp from "../components/PopUp"               // ✅

// CategoryManagement.jsx
import useAdminStore from "../store/useAdminStore"    // ✅
import useAdmin from "../customHooks/useAdmin" 
import ProviderRow from "./ProviderRow"

export default function ProviderApprovalTable() {

  const { fetchPendingProviders, approveProvider, rejectProvider } = useAdmin()
  const { pendingProviders, isLoading } = useAdminStore()
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    fetchPendingProviders()
  }, [])

  const handleApprove = async (providerId) => {
    try {
      await approveProvider(providerId)
      setPopup({ type: "success", message: "Provider approved!" })
    } catch(err) {
      setPopup({ type: "error", message: "Failed to approve" })
    }
  }

  const handleReject = async (providerId) => {
    try {
      await rejectProvider(providerId)
      setPopup({ type: "success", message: "Provider rejected!" })
    } catch(err) {
      setPopup({ type: "error", message: "Failed to reject" })
    }
  }

  return (
    <>
      {popup && <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      <div className="bg-white rounded-xl shadow-sm">

        <div className="p-4 border-b flex justify-between">
          <h2 className="font-semibold">Provider Approvals</h2>
          <span className="text-sm text-blue-600">{pendingProviders.length} Pending</span>
        </div>

        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : pendingProviders.length === 0 ? (
          <p className="text-center py-6 text-gray-400">No pending providers</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Provider Name</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Experience</th>
                <th className="p-3 text-left">Date Requested</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProviders.map(p => (
                <ProviderRow
                  key={p._id}
                  provider={p}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </tbody>
          </table>
        )}

      </div>
    </>
  )
}