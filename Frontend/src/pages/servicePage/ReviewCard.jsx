export default function ReviewCard() {

  return (
    <div className="border rounded-xl p-4 flex gap-4">

      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
        JD
      </div>

      <div>

        <div className="flex justify-between">
          <h4 className="font-semibold">Jane Doe</h4>
          <span className="text-yellow-500">★★★★★</span>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          SparkleClean did an amazing job! My apartment hasn't looked
          this good since I moved in.
        </p>

      </div>

    </div>
  )
}