export default function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">

      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-3">
        ✓
      </div>

      <h3 className="font-semibold">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        {desc}
      </p>

    </div>
  )
}