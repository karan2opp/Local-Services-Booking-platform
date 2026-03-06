import ServiceCard from "../../components/ServiceCard"
import EmptyState from "./EmptyState"

export default function ServiceGrid({ services }) {

  if(!services || services.length === 0){
    return <EmptyState />
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard
          key={service._id}   // ✅ use _id not id
          {...service}         // ✅ spread all fields
        />
      ))}
    </div>
  )
}