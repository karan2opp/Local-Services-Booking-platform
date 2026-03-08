import PartnerForm from "./PartnerForm"
import TrustBadges from "./TrustBadges"
import localPro from "../../assets/localPro.png"
export default function PartnerHero({ initialStatus }) {  // ✅ receive prop
  return (
    <div className="grid md:grid-cols-2 gap-10 items-start">

      {/* Left Content */}
      <div>
        <h1 className="text-4xl font-bold leading-tight">
          Grow your business with{" "}
          <span className="text-blue-600">LocalPro.</span>
        </h1>

        <p className="text-gray-600 mt-4">
          Join thousands of professionals earning more every day.
          Connect with clients in your area and take your
          service business to the next level.
        </p>

        <TrustBadges />

        <img
          src={localPro}
          className="rounded-xl mt-6 shadow-md"
        />
      </div>

      {/* Form */}
      <PartnerForm initialStatus={initialStatus} />  {/* ✅ pass prop */}

    </div>
  )
}