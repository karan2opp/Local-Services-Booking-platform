import { useEffect, useState } from "react"
import useAdmin from "../customHooks/useAdmin"
import useAdminStore from "../store/useAdminStore"
import PopUp from "../components/PopUp"

export default function UserManagement() {

  const { fetchApprovedProviders, approveProvider, rejectProvider } = useAdmin()
  const { approvedProviders, isLoading } = useAdminStore()
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    fetchApprovedProviders()
  }, [])

  const handleDisapprove = async (providerId) => {
    try {
      await rejectProvider(providerId)
      setPopup({ type: "success", message: "Provider disapproved!" })
    } catch(err) {
      setPopup({ type: "error", message: "Failed to disapprove" })
    }
  }

  return (
    <>
      {popup && <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}

      <div className="bg-white rounded-xl shadow-sm">

        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">User Management</h2>
          <span className="text-sm text-blue-600">{approvedProviders.length} Approved Providers</span>
        </div>

        {isLoading ? (
          <p className="text-center py-6 text-gray-500">Loading...</p>
        ) : approvedProviders.length === 0 ? (
          <p className="text-center py-6 text-gray-400">No approved providers</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">City</th>
                <th className="p-3 text-left">Experience</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {approvedProviders.map((provider) => (
                <tr key={provider._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{provider.userId?.username}</td>
                  <td className="p-3 text-gray-500">{provider.businessPhone}</td>
                  <td className="p-3 text-gray-500">{provider.provideraddress?.city}</td>
                  <td className="p-3 text-gray-500">{provider.experience} yrs</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                      Approved
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDisapprove(provider._id)}
                      className="px-3 py-1 text-xs border border-red-400 text-red-500 rounded-lg hover:bg-red-50"
                    >
                      Disapprove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </>
  )
}