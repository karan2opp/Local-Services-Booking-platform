import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axiosConfig";
import Navbar from "../../components/Navbar"
import PartnerForm from "../ServiceProvider/PartnerForm"


export default function UpdateProfile() {

  const navigate = useNavigate()
  const [providerData, setProviderData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/serviceProvider/myProfile", {
          withCredentials: true
        })
        setProviderData(res.data.data)
      } catch(err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  if(isLoading) return (
    <>
      <Navbar />
      <p className="text-center mt-10 text-gray-500">Loading...</p>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-xl">←</button>
          <h1 className="text-2xl font-bold">Update Profile</h1>
        </div>
        <PartnerForm
          initialStatus="approved"
          isEditing={true}              // ✅ editing mode
          providerData={providerData}   // ✅ pass existing data
        />
      </div>
    </>
  )
}