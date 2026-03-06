
export default function PriceModal({ price, tax, total, close, onConfirm, isLoading }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[350px] space-y-4">

        <h2 className="text-xl font-semibold">Confirm Booking</h2>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Service Price</span>
            <span>₹{price?.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes (14%)</span>
            <span>₹{tax?.toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={close}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}        // ✅ confirm booking
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:opacity-50"
          >
            {isLoading ? "Booking..." : "Confirm"}
          </button>
        </div>

      </div>
    </div>
  )
}