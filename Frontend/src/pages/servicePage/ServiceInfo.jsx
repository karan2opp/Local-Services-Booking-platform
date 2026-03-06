export default function ServiceInfo({ service }) {
  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold">
        Service Description
      </h2>

      <p className="text-gray-600">
        {service.description}
      </p>

      <div className="grid md:grid-cols-2 gap-4">

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Provider</h4>
          <p className="text-gray-500">
            {service.providerId?.userId?.username}
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Category</h4>
          <p className="text-gray-500">
            {service.categoryId?.name}
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Service Type</h4>
          <p className="text-gray-500 capitalize">
            {service.serviceType === "home" ? "🏠 Home Service" : "🏪 Store Visit"}
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Experience</h4>
          <p className="text-gray-500">
            {service.providerId?.experience} years
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Location</h4>
          <p className="text-gray-500">
            {service.providerId?.provideraddress?.city}, {service.providerId?.provideraddress?.area}
          </p>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold">Starting Price</h4>
          <p className="text-blue-600 font-semibold">
            ₹{service.price}
          </p>
        </div>

      </div>

    </div>
  )
}