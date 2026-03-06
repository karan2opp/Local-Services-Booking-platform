
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import './index.css'
import ServicePage from './pages/servicePage/ServicePage.jsx'
import SearchResultsPage from './pages/searchResult/SearchResultPage.jsx'
import MyBookingPage from './pages/bookingPage/MyBookingPage.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path:"/service/:serviceId",
    element:<ServicePage />
  },{
    path:"/search",
    element:<SearchResultsPage />
  },{
    path:"myBookings",
    element:<MyBookingPage />
  }
])



createRoot(document.getElementById('root')).render(

          <RouterProvider router={router} />
         
)