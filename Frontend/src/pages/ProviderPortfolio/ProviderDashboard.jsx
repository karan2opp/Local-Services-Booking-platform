import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../utils/axiosConfig";
import Navbar from "../../components/Navbar"
import MyServices from "./MyServices"
import PendingBookings from "./PendingBookings"
import ProviderSidebar from "./ProviderSidebar"
import StatsCards from "./StatsCard"
import useProviderBooking from "../../customHooks/useProviderBooking"  // ✅

export default function ProviderDashboard() {

  const navigate = useNavigate()
  const { fetchProviderBookings } = useProviderBooking()  // ✅

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axios.get("/api/serviceProvider/myStatus", {
          withCredentials: true
        })
        const status = res.data.data.status
        if(status !== "approved"){
          navigate("/Partner")
        }
      } catch(err) {
        navigate("/Partner")
      }
    }
    checkStatus()
    fetchProviderBookings()  // ✅ fetch all bookings once for whole dashboard
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="flex">
        <ProviderSidebar />
        <main className="flex-1 p-6 space-y-6">
          <StatsCards />
          <PendingBookings />
          <MyServices />
        </main>
      </div>
    </div>
  )
}