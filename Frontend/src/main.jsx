import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";

import useAuthStore from "./store/useAuthStore";
import Home from "./pages/Home.jsx";
import "./index.css";
import ServicePage from "./pages/servicePage/ServicePage.jsx";
import SearchResultsPage from "./pages/searchResult/SearchResultPage.jsx";
import MyBookingPage from "./pages/bookingPage/MyBookingPage.jsx";
import BecomePartner from "./pages/ServiceProvider/BecomePartner.jsx";
import ProviderDashboard from "./pages/ProviderPortfolio/ProviderDashboard.jsx";
import ServiceFormPage from "./pages/ProviderPortfolio/ServiceFormPage.jsx";
import BookingRequestsPage from "./pages/bookingRequestPage/BookingRequestsPage.jsx";
import UpdateProfile from "./pages/ProviderPortfolio/UpdateProfile.jsx";
import AdminDashboard from "./adminDashboard/AdminDashboard.jsx";
import axios from "./utils/axiosConfig.js";

function AuthProvider({ children }) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    

    const fetchUser = async () => {
      try {
        const res =  await axios.get("/api/user/me", {
          withCredentials: true,
        });
        login(res.data.user);
        console.log(res.data.user);
        
      } catch (err) {
        console.log("User not logged in",err);
        logout();
      }
    };

    fetchUser();
  }, []);

  return <>{children}</>;
}

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/service/:serviceId", element: <ServicePage /> },
  { path: "/search", element: <SearchResultsPage /> },
  { path: "/myBookings", element: <MyBookingPage /> },
  { path: "/Partner", element: <BecomePartner /> },
  { path: "/PartnerDashboard", element: <ProviderDashboard /> },
  { path: "/serviceForm", element: <ServiceFormPage /> },
  { path: "/PartnerBookings", element: <BookingRequestsPage /> },
  { path: "/UpdateProfile", element: <UpdateProfile /> },
  { path: "/admin", element: <AdminDashboard /> }
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);