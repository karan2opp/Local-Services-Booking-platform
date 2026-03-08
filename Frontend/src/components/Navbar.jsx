import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, Briefcase, User } from "lucide-react"
import AuthModal from "./AuthModal"
import useAuthStore from "../store/useAuthStore"
import axios from "axios"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [authType, setAuthType] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [area, setArea] = useState("")

  const dropdownRef = useRef(null)
  const navigate = useNavigate()


  const { user, isLoggedIn, logout, isProvider } = useAuthStore()  // ✅

  const handleSearch = () => {
    if(!search && !category && !city && !area) return
    const params = new URLSearchParams()
    if(search) params.set("q", search)
    if(category) params.set("category", category)
    if(city) params.set("city", city)
    if(area) params.set("area", area)
    navigate(`/search?${params.toString()}`)
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true })
      logout()
      setProfileOpen(false)
      navigate("/")
    } catch(error) {
      console.log(error.response?.data?.message || "Logout failed")
    }
  }

  useEffect(() => {
    const handleClick = (e) => {
      if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
        setProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`w-full sticky top-0 z-40 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Briefcase size={16} />
            </div>
            <span className="text-lg font-bold text-blue-600">LocalPro</span>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 gap-2 w-32 lg:w-40 xl:w-52 bg-white/90">
              <svg className="text-gray-400 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search services..."
                className="text-sm text-gray-600 placeholder-gray-400 outline-none w-full bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }}
              />
            </div>

            <select className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white"
              value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Category</option>
              <option value="Saloon">Saloon</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Cleaning">Cleaning</option>
              <option value="AC-Service">AC Service</option>
            </select>

            <select className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white"
              value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">City</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
            </select>

            <input
              type="text"
              placeholder="Area"
              className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white w-24"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }}
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 shrink-0">

            {/* ✅ Become a Pro / Partner Dashboard */}
            <button
              onClick={() => navigate(isProvider ? "/PartnerDashboard" : "/Partner")}
              className="hidden md:block text-sm text-gray-700 hover:text-blue-600 font-medium"
            >
              {isProvider ? "Partner Dashboard" : "Become a Pro"}
            </button>

            {/* Profile Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button className="p-2 rounded-full hover:bg-gray-100 transition">
                <User size={20} className="text-gray-600" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-8 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">

                  {isLoggedIn ? (
                    <>
                      <p className="px-4 py-2 text-sm text-black font-medium border-b border-gray-100">
                        👤 {user?.username}
                      </p>

                      <button
                        onClick={() => { navigate("/myBookings"); setProfileOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        My Bookings
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => { setAuthType("login"); setProfileOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => { setAuthType("signup"); setProfileOpen(false) }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Signup
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">

          <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 gap-2">
            <svg className="text-gray-400 shrink-0" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search services..."
              className="text-sm text-gray-600 outline-none w-full bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }}
            />
          </div>

          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600"
            value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Category</option>
            <option value="Saloon">Saloon</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Cleaning">Cleaning</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600"
            value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">City</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>

          <input type="text" placeholder="Area"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600"
            value={area} onChange={(e) => setArea(e.target.value)}
            onKeyDown={(e) => { if(e.key === "Enter") handleSearch() }} />

          <button onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm">
            Search
          </button>

          <hr />

          {/* ✅ Become a Pro / Partner Dashboard mobile */}
          <button
            onClick={() => { navigate(isProvider ? "/PartnerDashboard" : "/Partner"); setMenuOpen(false) }}
            className="block w-full text-left text-sm py-1 text-gray-700"
          >
            {isProvider ? "Partner Dashboard" : "Become a Pro"}
          </button>

          {isLoggedIn ? (
            <>
              <button onClick={() => { navigate("/myBookings"); setMenuOpen(false) }}
                className="block w-full text-left text-sm py-1 text-gray-700">
                My Bookings
              </button>
              <button onClick={handleLogout}
                className="block w-full text-left text-sm py-1 text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setAuthType("login"); setMenuOpen(false) }}
                className="block w-full text-left text-sm py-1 text-gray-700">
                Login
              </button>
              <button onClick={() => { setAuthType("signup"); setMenuOpen(false) }}
                className="block w-full text-left text-sm py-1 text-gray-700">
                Signup
              </button>
            </>
          )}

        </div>
      )}

      {authType && (
        <AuthModal type={authType} closeModal={() => setAuthType(null)} />
      )}

    </header>
  )
}