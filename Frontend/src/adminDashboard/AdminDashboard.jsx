import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminSidebar from "./AdminSidebar"
import AdminStats from "./AdminStats"
import CategoryManagement from "./CategoryManagement"
import ProviderApprovalTable from "./ProviderApprovalTable"
import UserManagement from "./UserManagment"
import Navbar from "../components/Navbar"
import useAuthStore from "../store/useAuthStore"

export default function AdminDashboard() {

  const [activeTab, setActiveTab] = useState("overview")
  const { user, isLoggedIn } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if(!isLoggedIn || user?.role !== "admin") {
      navigate("/")
    }
  }, [user, isLoggedIn])

  return (
    <div>
      <Navbar />
      <div className="flex bg-gray-50 min-h-screen">

        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6 space-y-6">

          {activeTab === "overview" && (
            <>
              <AdminStats />
              <ProviderApprovalTable />
              <CategoryManagement />
            </>
          )}

          {activeTab === "users" && (
            <UserManagement />
          )}

        </main>

      </div>
    </div>
  )
}