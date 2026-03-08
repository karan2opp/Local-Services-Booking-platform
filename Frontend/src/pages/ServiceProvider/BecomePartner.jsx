import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axiosConfig"
import Navbar from "../../components/Navbar"
import PartnerHero from "./PartnerHero"
import WhyJoinUs from "./WhyJoinUs"

export default function BecomePartner() {

  const [statusLoading, setStatusLoading] = useState(true)
  const [initialStatus, setInitialStatus] = useState("notApplied")
  const navigate = useNavigate()

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get("/api/serviceProvider/myStatus", {
          withCredentials: true
        })
        const status = res.data.data.status

        if(status === "approved"){
          navigate("/PartnerDashboard")
          return
        }

        setInitialStatus(status)

      } catch(err) {
        setInitialStatus("notApplied")
      } finally {
        setStatusLoading(false)
      }
    }
    checkStatus()
  }, [])

  if(statusLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <PartnerHero initialStatus={initialStatus} />  {/* ✅ pass prop */}
      </div>
      <WhyJoinUs />
    </div>
  )
}
