import { Inbox } from "lucide-react"

export default function EmptyRequests(){

  return (
    <div className="bg-white border rounded-xl p-10 text-center">

      <Inbox className="mx-auto text-gray-400 mb-3"/>

      <h3 className="font-semibold text-gray-700">
        No booking requests
      </h3>

      <p className="text-sm text-gray-500">
        New booking requests will appear here.
      </p>

    </div>
  )
}