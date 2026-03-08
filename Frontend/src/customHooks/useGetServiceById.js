// customHooks/useGetServiceById.js
import axios from "../utils/axiosConfig.js"
import useServiceDetailStore from "../store/useServiceDetailStore"

const useGetServiceById = () => {

  const { service, isLoading, error, setService, setLoading, setError } = useServiceDetailStore()

  const fetchServiceById = async (serviceId) => {
    setLoading(true)
    try {
      const res = await axios.get(`/api/service/${serviceId}`)
      setService(res.data.data)
    } catch(err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { service, isLoading, error, fetchServiceById }
}

export default useGetServiceById;