import ServiceCard from "./ServiceCard";

const services = [
  {
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952",
    category: "Cleaning",
    title: "Deep Home Cleaning",
    provider: "Sparkling Spaces Pro",
    rating: 4.9,
    price: 89
  },
  {
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    category: "Plumbing",
    title: "Emergency Pipe Repair",
    provider: "Rapid Fix Plumbing",
    rating: 4.8,
    price: 120
  },
  {
    image:
      "https://images.unsplash.com/photo-1581091870627-3c4d16c8b06a",
    category: "Handyman",
    title: "Furniture Assembly",
    provider: "Mike's Home Repairs",
    rating: 4.7,
    price: 45
  },
  {
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4",
    category: "Electrical",
    title: "Smart Home Setup",
    provider: "VoltMaster Solutions",
    rating: 5.0,
    price: 150
  },
  {
    image:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b",
    category: "Moving",
    title: "Local Apartment Move",
    provider: "SwiftMovers Co.",
    rating: 4.6,
    price: 299
  },
  {
    image:
      "https://images.unsplash.com/photo-1604147706283-d7119b5b822c",
    category: "Handyman",
    title: "TV Mounting Service",
    provider: "ProInstall Techs",
    rating: 4.9,
    price: 65
  }
];

export default function FeaturedServices() {
  return (
    <section className="max-w-6xl mx-auto px-6 mt-10">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold">
          Featured Services
        </h2>

        <button className="text-sm text-blue-600">
          Sort by: Recommended ▼
        </button>

      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>

    </section>
  );
}