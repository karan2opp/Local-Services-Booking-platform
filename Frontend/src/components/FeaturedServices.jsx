import { useEffect } from "react"
import useGetServices from "../customHooks/useGetServices"
import useServiceStore from "../store/useServiceStore"
import ServiceCard from "./ServiceCard"

export default function FeaturedServices() {

  const { fetchServices } = useGetServices()
  const { services, isLoading, error, pagination } = useServiceStore()

  useEffect(() => {
    fetchServices({}, 1)
  }, [])

  // handle load more
  const handleLoadMore = () => {
    if(pagination.hasNextPage){
      fetchServices({}, pagination.currentPage + 1)
    }
  }

  if(error) return <p>Something went wrong!</p>

  return (
    <section className="max-w-6xl mx-auto px-6 mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Featured Services</h2>
        <button className="text-sm text-blue-600">
          Sort by: Recommended ▼
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} {...service} />
        ))}
      </div>

      {/* Load More Button */}
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

      {/* show loading skeleton on initial load */}
      {isLoading && services.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Loading...</p>
      )}

    </section>
  )
}
