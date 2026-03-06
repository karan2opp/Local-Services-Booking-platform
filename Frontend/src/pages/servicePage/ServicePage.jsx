// pages/ServicePage/ServicePage.jsx
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import Navbar from "../../components/Navbar"
import BeforeAfterSlider from "./BeforeAfterSlider"
import BookingCard from "./BookingCard"
import ReviewCard from "./ReviewCard"
import ServiceInfo from "./ServiceInfo"
import useGetServiceById from "../../customHooks/useGetServiceById"
import useServiceDetailStore from "../../store/useServiceDetailStore"

export default function ServicePage() {

  const { serviceId } = useParams()  // ✅ get id from URL
  const { fetchServiceById } = useGetServiceById()
  const { service, isLoading, error } = useServiceDetailStore()

  useEffect(() => {
    fetchServiceById(serviceId)
  }, [serviceId])

  if(isLoading) return <p className="text-center mt-10">Loading...</p>
  if(error) return <p className="text-center mt-10 text-red-500">Something went wrong!</p>
  if(!service) return null

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">
          {service.serviceName}
        </h1>

        <p className="text-gray-500 mb-6">
          {service.providerId?.userId?.username} ⭐ {service.providerId?.rating || "New"} 
        </p>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* Service Image */}
            <img
              src={service.image}
              alt={service.serviceName}
              className="rounded-xl w-full h-[350px] object-cover"
            />

            {/* Service Info */}
            <ServiceInfo service={service} />

            {/* Before After Slider */}
            {service.beforeAfterImages?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Before & After
                </h2>
                <BeforeAfterSlider pairs={service.beforeAfterImages} />
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Customer Reviews
              </h2>
              <ReviewCard />
            </div>

          </div>

          {/* RIGHT SIDE BOOKING */}
          <BookingCard service={service} />

        </div>

      </div>
    </div>
  )
}