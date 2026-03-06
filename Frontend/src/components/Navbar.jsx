
import { useState, useEffect, useRef } from "react";
import { Menu, X, Briefcase, User } from "lucide-react";
import AuthModal from "./AuthModal";
import useAuthStore from "../store/useAuthStore";
import axios from "axios";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [authType, setAuthType] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);

  const { user, isLoggedIn, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axios.post("/api/user/logout", {}, { withCredentials: true });
      logout();
      setProfileOpen(false);
    } catch (error) {
      console.log(error.response?.data?.message || "Logout failed");
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md   shadow-sm"
          : "bg-transparent"
      }`}
    >
      {/* NAVBAR */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14 gap-3">

          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Briefcase size={16} />
            </div>
            <span className="text-lg font-bold text-blue-600">
              LocalPro
            </span>
          </div>

          {/* Search + Filters */}
          <div className="hidden md:flex items-center gap-2">

            <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 gap-2 w-32 lg:w-40 xl:w-52 bg-white/90">
              <svg
                className="text-gray-400 shrink-0"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
                type="text"
                placeholder="Search services..."
                className="text-sm text-gray-600 placeholder-gray-400 outline-none w-full bg-transparent"
              />
            </div>

            <select className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white">
              <option>Category</option>
            </select>

            <select className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white">
              <option>City</option>
            </select>

            <select className="border border-gray-300 rounded-full px-2 py-1.5 text-sm text-gray-600 bg-white">
              <option>Area</option>
            </select>

          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 shrink-0">

            <button className="hidden md:block text-sm text-gray-700 hover:text-blue-600 font-medium">
              Become a Pro
            </button>

            {/* Profile Dropdown */}
            <div ref={dropdownRef} className="relative">

              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <User size={20} className="text-gray-600" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-2">

                  {isLoggedIn ? (
                    <>
                      <p className="px-4 py-2 text-sm text-gray-700 font-medium">
                        {user?.username}
                      </p>

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
                        onClick={() => {
                          setAuthType("login");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Login
                      </button>

                      <button
                        onClick={() => {
                          setAuthType("signup");
                          setProfileOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Signup
                      </button>
                    </>
                  )}

                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3">

          <div className="flex items-center border border-gray-300 rounded-full px-3 py-2 gap-2">
            <svg
              className="text-gray-400 shrink-0"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              type="text"
              placeholder="Search services..."
              className="text-sm text-gray-600 outline-none w-full bg-transparent"
            />
          </div>

          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600">
            <option>Category</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600">
            <option>City</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm text-gray-600">
            <option>Area</option>
          </select>

          <hr />

          <button className="block w-full text-left text-sm py-1 text-gray-700 hover:text-blue-600 font-medium">
            Become a Pro
          </button>

        </div>
      )}

      {/* AUTH MODAL */}
      {authType && (
        <AuthModal
          type={authType}
          closeModal={() => setAuthType(null)}
        />
      )}
    </header>
  );
}

