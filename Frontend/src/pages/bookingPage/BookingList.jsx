import BookingCard from "./BookingCard"
import BookingEmpty from "./BookingEmpty"

export default function BookingList({ bookings, onCancel }) {

  if(!bookings || bookings.length === 0){
    return <BookingEmpty />
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onCancel={onCancel}
        />
      ))}
    </div>
  )
}