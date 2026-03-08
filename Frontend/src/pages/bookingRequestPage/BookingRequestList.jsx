import BookingRequestCard from "./BookingRequestCard"
import EmptyRequests from "./EmptyRequests"

export default function BookingRequestList({ requests, onAccept, onReject }) {

  if(!requests || !requests.length){
    return <EmptyRequests />
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <BookingRequestCard
          key={req._id}
          request={req}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  )
}