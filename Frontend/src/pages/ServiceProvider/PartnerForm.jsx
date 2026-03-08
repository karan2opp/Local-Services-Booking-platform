import { useState } from "react"
import axios from "axios"
import PopUp from "../../components/PopUp"

export default function PartnerForm({ initialStatus, isEditing = false, providerData = null }) {

  const [formData, setFormData] = useState({
    businessPhone: providerData?.businessPhone || "",
    experience: providerData?.experience || "",
    street: providerData?.provideraddress?.street || "",
    city: providerData?.provideraddress?.city || "",
    area: providerData?.provideraddress?.area || "",
    state: providerData?.provideraddress?.state || "",
    pincode: providerData?.provideraddress?.pincode || ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [popup, setPopup] = useState(null)
  const [isPending, setIsPending] = useState(initialStatus === "pending")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    if(!formData.businessPhone || !formData.experience || !formData.city){
      setPopup({ type: "warning", message: "Please fill all required fields" })
      return
    }

    setIsLoading(true)
    try {
      if(isEditing){
        // ✅ update existing profile
        await axios.patch("/api/serviceProvider/updateMyProfile", {
          businessPhone: formData.businessPhone,
          experience: formData.experience,
          street: formData.street,
          city: formData.city,
          area: formData.area,
          state: formData.state,
          pincode: formData.pincode
        }, { withCredentials: true })
        setPopup({ type: "success", message: "Profile updated successfully!" })

      } else {
        // ✅ register as new provider
        await axios.post("/api/serviceProvider/registerAsProvider", {
          businessPhone: formData.businessPhone,
          experience: formData.experience,
          street: formData.street,
          city: formData.city,
          area: formData.area,
          state: formData.state,
          pincode: formData.pincode
        }, { withCredentials: true })
        setIsPending(true)
      }

    } catch(err) {
      setPopup({ type: "error", message: err.response?.data?.message || "Something went wrong" })
    } finally {
      setIsLoading(false)
    }
  }

  if(isPending){
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 text-center space-y-4">
        <div className="text-5xl">⏳</div>
        <h2 className="text-xl font-semibold">Application Under Review</h2>
        <p className="text-gray-500 text-sm">
          Your partner application has been submitted and is currently being reviewed by our team.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
          <p className="text-yellow-600 text-sm font-medium">Status: Pending Approval</p>
        </div>
        <p className="text-xs text-gray-400">
          We'll notify you once your application is approved!
        </p>
      </div>
    )
  }

  return (
    <>
      {popup && (
        <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />
      )}

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {isEditing ? "Update Profile" : "Become a Partner"}  {/* ✅ dynamic title */}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <input type="tel" name="businessPhone" placeholder="Business Phone *"
            className="border rounded-lg p-2 text-sm" value={formData.businessPhone} onChange={handleChange} />
          <input type="number" name="experience" placeholder="Years of Experience *"
            className="border rounded-lg p-2 text-sm" value={formData.experience} onChange={handleChange} />
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Address</h3>
          <input type="text" name="street" placeholder="Street Address"
            className="border rounded-lg p-2 text-sm w-full" value={formData.street} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" name="city" placeholder="City *"
              className="border rounded-lg p-2 text-sm" value={formData.city} onChange={handleChange} />
            <input type="text" name="area" placeholder="Area"
              className="border rounded-lg p-2 text-sm" value={formData.area} onChange={handleChange} />
            <input type="text" name="state" placeholder="State"
              className="border rounded-lg p-2 text-sm" value={formData.state} onChange={handleChange} />
            <input type="text" name="pincode" placeholder="Pincode"
              className="border rounded-lg p-2 text-sm" value={formData.pincode} onChange={handleChange} />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
          {isLoading
            ? isEditing ? "Updating..." : "Submitting..."
            : isEditing ? "Update Profile" : "Apply Now →"  // ✅ dynamic button
          }
        </button>

        {!isEditing && (
          <p className="text-xs text-gray-400 text-center">
            By clicking Apply Now you agree to our terms.
          </p>
        )}
      </div>
    </>
  )
}