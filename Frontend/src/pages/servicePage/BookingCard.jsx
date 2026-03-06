import { useState } from "react"
import PriceModal from "./PriceModal"

export default function BookingCard({ service }) {

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [showModal, setShowModal] = useState(false)

  const taxes = service?.price * 0.14
  const total = service?.price + taxes

  return (
    <>
      <div className="bg-white shadow-xl rounded-xl p-6 space-y-4 h-fit">

        <h3 className="font-semibold text-lg">Book Service</h3>

        {/* price */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Price</span>
          <span className="text-blue-600 font-semibold">₹{service?.price}</span>
        </div>

        {/* service type */}
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Type</span>
          <span className="capitalize">
            {service?.serviceType === "home" ? "🏠 Home Service" : "🏪 Store Visit"}
          </span>
        </div>

        {/* date */}
        <div>
          <p className="text-sm mb-1">Choose Date</p>
          <input
            type="date"
            className="border rounded-lg w-full p-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* time */}
        <div>
          <p className="text-sm mb-1">Choose Time</p>
          <input
            type="time"
            className="border rounded-lg w-full p-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={!date || !time}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          Book Now
        </button>

      </div>

      {showModal && (
        <PriceModal
          price={service?.price}
          tax={taxes}
          total={total}
          close={() => setShowModal(false)}
        />
      )}
    </>
  )
}