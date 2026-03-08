// customHooks/useAdmin.js
import axios from "axios"
import useAdminStore from "../store/useAdminStore"

const useAdmin = () => {

  const {
    pendingProviders, approvedProviders, rejectedProviders, categories,
    isLoading, error,
    setPendingProviders, setApprovedProviders, setRejectedProviders,
    setCategories, setLoading, setError
  } = useAdminStore()

  // ✅ providers
  const fetchPendingProviders = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/admin/getPendingProvider", { withCredentials: true })
      setPendingProviders(res.data.data)
    } catch(err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const approveProvider = async (providerId) => {
    try {
      await axios.patch(`/api/admin/approvePendingProvider/${providerId}`, {}, { withCredentials: true })
      useAdminStore.setState(state => ({
        pendingProviders: state.pendingProviders.filter(p => p._id !== providerId)
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const rejectProvider = async (providerId) => {
    try {
      await axios.patch(`/api/admin/rejectPendingProvider/${providerId}`, {}, { withCredentials: true })
      useAdminStore.setState(state => ({
        pendingProviders: state.pendingProviders.filter(p => p._id !== providerId)
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  // ✅ categories
  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/admin/getCategories", { withCredentials: true })
      setCategories(res.data.data)
    } catch(err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (formData) => {
    try {
      const res = await axios.post("/api/admin/createCategory", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
      useAdminStore.setState(state => ({
        categories: [res.data.data, ...state.categories]
      }))
      return res.data.data
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const updateCategory = async (categoryId, formData) => {
    try {
      const res = await axios.patch(`/api/admin/updateCategory/${categoryId}`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      })
      useAdminStore.setState(state => ({
        categories: state.categories.map(c => c._id === categoryId ? res.data.data : c)
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }

  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/admin/deleteCategory/${categoryId}`, { withCredentials: true })
      useAdminStore.setState(state => ({
        categories: state.categories.filter(c => c._id !== categoryId)
      }))
    } catch(err) {
      setError(err.response?.data?.message || err.message)
      throw err
    }
  }
  const fetchApprovedProviders = async () => {
  setLoading(true)
  try {
    const res = await axios.get("/api/admin/getAllApprovedProvider", { withCredentials: true })
    setApprovedProviders(res.data.data)
  } catch(err) {
    setError(err.response?.data?.message || err.message)
  } finally {
    setLoading(false)
  }
}

  return {
    pendingProviders, approvedProviders, rejectedProviders, categories,
    isLoading, error,
    fetchPendingProviders, approveProvider, rejectProvider,fetchApprovedProviders,
    fetchCategories, createCategory, updateCategory, deleteCategory
  }
}

export default useAdmin