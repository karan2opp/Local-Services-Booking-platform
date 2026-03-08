export default function ProviderRow({ provider, onApprove, onReject }) {

  const date = new Date(provider.createdAt).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric"
  })

  return (
    <tr className="border-t">
      <td className="p-3">{provider.userId?.username}</td>
      <td className="p-3 text-gray-500">{provider.provideraddress?.city}</td>
      <td className="p-3 text-gray-500">{provider.experience} yrs</td>
      <td className="p-3 text-gray-500">{date}</td>
      <td className="p-3 flex gap-2">
        <button
          onClick={() => onApprove(provider._id)}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(provider._id)}
          className="px-3 py-1 text-xs border rounded-lg hover:bg-gray-50"
        >
          Deny
        </button>
      </td>
    </tr>
  )
}