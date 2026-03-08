import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "../utils/axiosConfig";

export default function Hero() {

  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState([])

  useEffect(() => {
    axios.get("/api/admin/getCategories")
      .then(res => setCategories(res.data.data))
      .catch(err => console.error(err))
  }, [])

  const handleSearch = () => {
    if(!search.trim()) return
    const params = new URLSearchParams()
    params.set("q", search)
    navigate(`/search?${params.toString()}`)
  }

  const handleTagClick = (categoryName) => {
    const params = new URLSearchParams()
    params.set("category", categoryName)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <section className="max-w-6xl mx-auto mt-6 px-6">
      <div
        className="relative rounded-xl overflow-hidden bg-cover bg-center h-[360px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative text-center text-white max-w-3xl px-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Your home, handled by professionals.
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-200">
            Book trusted local services in seconds
          </p>

          {/* Search bar */}
          <div className="mt-6 flex items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-xl mx-auto">
            <div className="flex items-center px-3 text-gray-400">
              <Search size={18} />
            </div>

            <input
              type="text"
              placeholder="What do you need help with?"
              className="flex-1 px-2 py-3 text-sm text-gray-700 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }}
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-sm font-medium"
            >
              Search
            </button>
          </div>

          {/* ✅ Popular tags from backend */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-200">Popular:</span>
            {categories.slice(0, 4).map((cat) => (
              <span
                key={cat._id}
                onClick={() => handleTagClick(cat.name)}
                className="bg-white/20 px-3 py-1 rounded-full cursor-pointer hover:bg-white/30 transition"
              >
                {cat.name}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}