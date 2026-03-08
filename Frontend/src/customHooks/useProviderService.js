import { useState } from "react"
import axios from "../utils/axiosConfig.js"

const useProviderService = () => {

  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
const fetchMyServices = async () => {
  setIsLoading(true)
  try {
    const res = await axios.get("/api/serviceProvider/myServices", {
      withCredentials: true
    })
    setServices(res.data.data)  // ✅ this line is missing!
  } catch(err) {
    setError(err.response?.data?.message || err.message)
  } finally {
    setIsLoading(false)
  }
}

  const createService = async (formData) => {
    setIsLoading(true)
    try {
      const res = await axios.post("/api/serviceProvider/addService", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
      setServices((prev) => [res.data.data, ...prev])
      return res.data.data  // ✅ return so we can get _id
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateService = async (serviceId, formData) => {
    setIsLoading(true)
    try {
      const res = await axios.patch(
        `/api/serviceProvider/updateService/${serviceId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      setServices((prev) => prev.map(s => s._id === serviceId ? res.data.data : s))
      return res.data.data
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // ✅ update before/after portfolio
  const updatePortfolio = async (serviceId, formData) => {
    try {
      const res = await axios.patch(
        `/api/serviceProvider/updatePortfolio/${serviceId}`,
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      )
      // update service in list with new portfolio
      setServices((prev) => prev.map(s => s._id === serviceId ? res.data.data : s))
      return res.data.data
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const deleteService = async (serviceId) => {
    try {
      await axios.delete(
        `/api/serviceProvider/deleteService/${serviceId}`,
        { withCredentials: true }
      )
      setServices((prev) => prev.filter(s => s._id !== serviceId))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  return {
    services,
    isLoading,
    error,
    fetchMyServices,
    createService,
    updateService,
    updatePortfolio,  // ✅
    deleteService
  }
}

export default useProviderService
