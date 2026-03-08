import FeatureCard from "./FeatureCard"

export default function WhyJoinUs() {

  const features = [
    {
      title: "More leads",
      desc: "Stop chasing clients. We match you with high-quality leads in your area."
    },
    {
      title: "Secure payments",
      desc: "Get paid on time with secure platform handling invoices and payments."
    },
    {
      title: "Flexible schedule",
      desc: "You are in control. Set your own availability and choose jobs."
    }
  ]

  return (
    <section className="bg-gray-100 py-16">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-10">

          <h2 className="text-2xl font-bold">
            Why join us?
          </h2>

          <p className="text-gray-500 mt-2">
            We provide the tools and clients, you provide the expertise.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}

        </div>

      </div>

    </section>
  )
}