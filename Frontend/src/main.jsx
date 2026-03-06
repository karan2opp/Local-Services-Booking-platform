
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import './index.css'
import ServicePage from './pages/servicePage/ServicePage.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path:"/service/:serviceId",
    element:<ServicePage />
  }
  
])



createRoot(document.getElementById('root')).render(

          <RouterProvider router={router} />
         
)