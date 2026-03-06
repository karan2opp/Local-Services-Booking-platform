import { useEffect } from "react"
import axios from "axios"
import useServiceStore from "../store/useServiceStore"

const useGetServices = (filters = {}) => {

  const { 
    services,
    isLoading,
    error,
    pagination,
    setServices,
    appendServices,  // ✅
    setLoading,
    setError,
    setPagination
  } = useServiceStore()

  const fetchServices = async (filters = {}, page = 1) => {
    setLoading(true)
    try {
      const res = await axios.get("/api/service/search", {
        params:{
          category: filters.category || "",
          city: filters.city || "",
          area: filters.area || "",
          page,
          limit: 9
        }
      })

      if(page === 1){
        setServices(res.data.data.services)    // ✅ replace on first load
      } else {
        appendServices(res.data.data.services) // ✅ append on load more
      }

      setPagination(res.data.data.pagination)

    } catch(err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices(filters, 1)
  }, [])

  return { services, isLoading, error, pagination, fetchServices }
}

export default useGetServices