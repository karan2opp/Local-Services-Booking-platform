import { useState } from "react"

export default function BeforeAfterSlider({ pairs }) {

  const [index, setIndex] = useState(0)

  if(!pairs || pairs.length === 0) return null

  const prev = () => setIndex((index - 1 + pairs.length) % pairs.length)
  const next = () => setIndex((index + 1) % pairs.length)

  return (
    <div className="space-y-4">

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Before</p>
          <img
            src={pairs[index].before}
            className="rounded-xl h-64 w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">After</p>
          <img
            src={pairs[index].after}
            className="rounded-xl h-64 w-full object-cover"
          />
        </div>
      </div>

      {/* caption */}
      {pairs[index].caption && (
        <p className="text-center text-sm text-gray-500">
          {pairs[index].caption}
        </p>
      )}

      {/* navigation — only show if more than 1 pair */}
      {pairs.length > 1 && (
        <div className="flex justify-center gap-4">
          <button onClick={prev} className="px-4 py-2 border rounded-lg">
            Prev
          </button>
          <span className="text-sm text-gray-500 self-center">
            {index + 1} / {pairs.length}
          </span>
          <button onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Next
          </button>
        </div>
      )}

    </div>
  )
}