import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import ServiceGrid from "./ServicesGrid"
import Navbar from "../../components/Navbar"
import useGetServices from "../../customHooks/useGetServices"
import useServiceStore from "../../store/useServiceStore"

export default function SearchResultsPage() {

  const location = useLocation()
  const query = new URLSearchParams(location.search).get("q")
  const city = new URLSearchParams(location.search).get("city")
  const area = new URLSearchParams(location.search).get("area")

  const { fetchServices } = useGetServices()
  const { services, isLoading, error, pagination } = useServiceStore()

  // fetch when query changes
  useEffect(() => {
    fetchServices({
      category: query || "",
      city: city || "",
      area: area || ""
    }, 1)
  }, [query, city, area])  // ✅ refetch when search changes

  const handleLoadMore = () => {
    if(pagination.hasNextPage){
      fetchServices({
        category: query || "",
        city: city || "",
        area: area || ""
      }, pagination.currentPage + 1)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-2xl font-bold mb-8">
          Results for "{query}"
        </h1>

        {/* loading skeleton */}
        {isLoading && services.length === 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"/>
            ))}
          </div>
        )}

        {/* error */}
        {error && (
          <p className="text-center text-red-500 mt-10">
            Something went wrong!
          </p>
        )}

        {/* results */}
        {!isLoading && !error && (
          <>
            <ServiceGrid services={services} />

            {/* load more */}
            {pagination.hasNextPage && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}