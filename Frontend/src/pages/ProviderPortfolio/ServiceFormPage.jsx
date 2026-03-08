import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import useProviderService from "../../customHooks/useProviderService"
import PopUp from "../../components/PopUp"
import Navbar from "../../components/Navbar"
import { X, RefreshCw, Trash2 } from "lucide-react"
import { compressImage } from "../../utils/compressImage"
import axios from "../../utils/axiosConfig";
import { useEffect } from "react"

export default function ServiceFormPage() {

  const navigate = useNavigate()
  const location = useLocation()
  const service = location.state?.service
  const isEditing = !!service

  const { createService, updateService, updatePortfolio, isLoading } = useProviderService()
  const [popup, setPopup] = useState(null)
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])

useEffect(() => {
  axios.get("/api/admin/getCategories")
    .then(res => setCategories(res.data.data))
    .catch(err => console.error(err))
}, [])
  const [preview, setPreview] = useState(
    Array.isArray(service?.image) ? service?.image[0] : service?.image || null
  )

  // ✅ load existing pairs from service
  const [existingPairs, setExistingPairs] = useState(
    service?.beforeAfterImages || []
  )

  // ✅ track replacements: { existingIndex: { before: File|null, after: File|null, beforePreview, afterPreview, caption } }
  const [replacedPairs, setReplacedPairs] = useState({})

  // ✅ track which existing pairs are marked for deletion
  const [deletedPairIndexes, setDeletedPairIndexes] = useState([])

  // ✅ new pairs to be uploaded
  const [newPairs, setNewPairs] = useState([])
  const [newPair, setNewPair] = useState({
    before: null, after: null,
    beforePreview: null, afterPreview: null,
    caption: ""
  })

  const [formData, setFormData] = useState({
    serviceName: service?.serviceName || "",
    description: service?.description || "",
    price: service?.price || "",
    serviceType: service?.serviceType || "home",
    categoryId: service?.categoryId?._id || ""
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if(file){
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handlePairImage = (e, type) => {
    const file = e.target.files[0]
    if(file){
      setNewPair(prev => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: URL.createObjectURL(file)
      }))
    }
  }

  // ✅ Handle replacing a single image (before or after) in an existing pair
  const handleReplaceExistingImage = (e, pairIndex, type) => {
    const file = e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setReplacedPairs(prev => ({
      ...prev,
      [pairIndex]: {
        ...prev[pairIndex],
        [type]: file,
        [`${type}Preview`]: preview,
        // Preserve caption from existing pair if not already set
        caption: prev[pairIndex]?.caption ?? existingPairs[pairIndex]?.caption ?? ""
      }
    }))
  }

  // ✅ Update caption for an existing pair replacement
  const handleReplaceCaption = (pairIndex, value) => {
    setReplacedPairs(prev => ({
      ...prev,
      [pairIndex]: {
        ...prev[pairIndex],
        caption: value
      }
    }))
  }

  // ✅ Toggle delete for an existing pair
  const handleToggleDeleteExistingPair = (index) => {
    setDeletedPairIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
    // Also clear any replacement for this pair if deleting
    setReplacedPairs(prev => {
      const updated = { ...prev }
      delete updated[index]
      return updated
    })
  }

  const handleAddNewPair = () => {
    if(!newPair.before || !newPair.after){
      setPopup({ type: "warning", message: "Please select both before and after images" })
      return
    }
    const activePairs = existingPairs.filter((_, i) => !deletedPairIndexes.includes(i)).length
    const totalPairs = activePairs + newPairs.length
    if(totalPairs >= 3){
      setPopup({ type: "warning", message: "Maximum 3 pairs allowed" })
      return
    }
    setNewPairs(prev => [...prev, newPair])
    setNewPair({ before: null, after: null, beforePreview: null, afterPreview: null, caption: "" })
  }

  const handleRemoveNewPair = (index) => {
    setNewPairs(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if(!formData.serviceName || !formData.price || (!isEditing && !formData.categoryId)){
      setPopup({ type: "warning", message: "Please fill all required fields" })
      return
    }

    try {
      // Step 1 — create/update service
      const data = new FormData()
      data.append("serviceName", formData.serviceName)
      data.append("description", formData.description)
      data.append("price", formData.price)
      data.append("serviceType", formData.serviceType)
      if(!isEditing) data.append("categoryId", formData.categoryId)
      if(image) data.append("image", image)

      let serviceId

      if(isEditing){
        await updateService(service._id, data)
        serviceId = service._id
      } else {
        const created = await createService(data)
        serviceId = created._id
      }

      // Step 2 — upload new before/after pairs + replacements + deletions
      const hasPortfolioChanges =
        newPairs.length > 0 ||
        Object.keys(replacedPairs).length > 0 ||
        deletedPairIndexes.length > 0

      if(hasPortfolioChanges){
        const portfolioData = new FormData()

        // ✅ Append new pairs
        for(let index = 0; index < newPairs.length; index++){
          const pair = newPairs[index]
          const [compressedBefore, compressedAfter] = await Promise.all([
            compressImage(pair.before),
            compressImage(pair.after)
          ])
          portfolioData.append(`before_${index}`, compressedBefore)
          portfolioData.append(`after_${index}`, compressedAfter)
          portfolioData.append(`caption_${index}`, pair.caption || "")
        }

        // Always send both sides — new file if replaced, existing URL if not
        for(const [existingIndex, replacement] of Object.entries(replacedPairs)){
          const original = existingPairs[Number(existingIndex)]
          portfolioData.append(`replaceIndex_${existingIndex}`, existingIndex)

          if(replacement.before){
            const compressed = await compressImage(replacement.before)
            portfolioData.append(`replaceBefore_${existingIndex}`, compressed)
          } else {
            portfolioData.append(`replaceBeforeUrl_${existingIndex}`, original.before)
          }

          if(replacement.after){
            const compressed = await compressImage(replacement.after)
            portfolioData.append(`replaceAfter_${existingIndex}`, compressed)
          } else {
            portfolioData.append(`replaceAfterUrl_${existingIndex}`, original.after)
          }

          if(replacement.caption !== undefined){
            portfolioData.append(`replaceCaption_${existingIndex}`, replacement.caption)
          }
        }

        // ✅ Append deleted indexes
        deletedPairIndexes.forEach(index => {
          portfolioData.append("deletePairIndex", index)
        })

        await updatePortfolio(serviceId, portfolioData)
      }

      setPopup({ type: "success", message: isEditing ? "Service updated!" : "Service created!" })
      setTimeout(() => navigate("/PartnerDashboard"), 1500)

    } catch(err) {
      setPopup({ type: "error", message: err.response?.data?.message || "Something went wrong" })
    }
  }

  const activePairsCount = existingPairs.filter((_, i) => !deletedPairIndexes.includes(i)).length
  const totalPairs = activePairsCount + newPairs.length

  return (
    <>
      {popup && <PopUp type={popup.type} message={popup.message} onClose={() => setPopup(null)} />}
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700 text-xl">←</button>
          <h1 className="text-2xl font-bold">
            {isEditing ? "Update Service" : "Create New Service"}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">

          {/* Cover Image */}
          <div
            onClick={() => document.getElementById("serviceImage").click()}
            className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50"
          >
            {preview ? (
              <img src={preview} className="h-40 w-full object-cover rounded-lg" />
            ) : (
              <>
                <p className="font-medium text-gray-600">Upload Cover Image *</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
              </>
            )}
            <input id="serviceImage" type="file" accept="image/*" className="hidden" onChange={handleImage} />
          </div>

          {/* Service Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Service Name *</label>
            <input type="text" name="serviceName"
              className="border rounded-lg p-2 w-full mt-1 text-sm"
              placeholder="e.g. Home Deep Cleaning"
              value={formData.serviceName} onChange={handleChange} />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea name="description"
              className="border rounded-lg p-2 w-full mt-1 text-sm resize-none"
              rows={3} placeholder="Describe your service..."
              value={formData.description} onChange={handleChange} />
          </div>

          {/* Price + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Price (₹) *</label>
              <input type="number" name="price"
                className="border rounded-lg p-2 w-full mt-1 text-sm"
                placeholder="e.g. 499"
                value={formData.price} onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Service Type</label>
              <select name="serviceType"
                className="border rounded-lg p-2 w-full mt-1 text-sm"
                value={formData.serviceType} onChange={handleChange}>
                <option value="home">🏠 Home Service</option>
                <option value="store">🏪 Store Visit</option>
              </select>
            </div>
          </div>

          {/* Category — only on create */}
         {!isEditing && (
  <div>
    <label className="text-sm font-medium text-gray-700">Category *</label>
    <select
      name="categoryId"
      className="border rounded-lg p-2 w-full mt-1 text-sm"
      value={formData.categoryId}
      onChange={handleChange}
    >
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>
  </div>
)}

          {/* ✅ Before/After Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Before & After Images</label>
              <span className="text-xs text-gray-400">{totalPairs}/3 pairs</span>
            </div>

            {/* ✅ Existing pairs from backend — now with replace & delete */}
            {existingPairs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium">Existing Pairs</p>
                {existingPairs.map((pair, index) => {
                  const isDeleted = deletedPairIndexes.includes(index)
                  const replacement = replacedPairs[index] || {}

                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 space-y-2 transition-all ${
                        isDeleted ? "bg-red-50 border-red-200 opacity-60" : "bg-gray-50"
                      }`}
                    >
                      {/* Header */}
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium text-gray-600">
                          Pair {index + 1}
                          {isDeleted && <span className="ml-2 text-red-500">(will be deleted)</span>}
                          {Object.keys(replacement).length > 0 && !isDeleted && (
                            <span className="ml-2 text-orange-500">(modified)</span>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          {/* Delete / Undo delete toggle */}
                          <button
                            onClick={() => handleToggleDeleteExistingPair(index)}
                            className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border transition-colors ${
                              isDeleted
                                ? "border-gray-400 text-gray-600 hover:bg-gray-100"
                                : "border-red-400 text-red-500 hover:bg-red-50"
                            }`}
                          >
                            <Trash2 size={11} />
                            {isDeleted ? "Undo" : "Delete"}
                          </button>
                        </div>
                      </div>

                      {/* Images */}
                      {!isDeleted && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {/* Before */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-400">Before</p>
                                <button
                                  onClick={() => document.getElementById(`replaceBefore_${index}`).click()}
                                  className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-700"
                                >
                                  <RefreshCw size={10} /> Replace
                                </button>
                                <input
                                  id={`replaceBefore_${index}`}
                                  type="file" accept="image/*" className="hidden"
                                  onChange={(e) => handleReplaceExistingImage(e, index, "before")}
                                />
                              </div>
                              <img
                                src={replacement.beforePreview || pair.before}
                                className={`w-full h-20 object-cover rounded-lg ${replacement.beforePreview ? "ring-2 ring-orange-400" : ""}`}
                              />
                            </div>

                            {/* After */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-xs text-gray-400">After</p>
                                <button
                                  onClick={() => document.getElementById(`replaceAfter_${index}`).click()}
                                  className="flex items-center gap-0.5 text-xs text-blue-500 hover:text-blue-700"
                                >
                                  <RefreshCw size={10} /> Replace
                                </button>
                                <input
                                  id={`replaceAfter_${index}`}
                                  type="file" accept="image/*" className="hidden"
                                  onChange={(e) => handleReplaceExistingImage(e, index, "after")}
                                />
                              </div>
                              <img
                                src={replacement.afterPreview || pair.after}
                                className={`w-full h-20 object-cover rounded-lg ${replacement.afterPreview ? "ring-2 ring-orange-400" : ""}`}
                              />
                            </div>
                          </div>

                          {/* Caption */}
                          <input
                            type="text"
                            placeholder="Caption (optional)"
                            className="border rounded-lg p-2 w-full text-xs"
                            value={replacement.caption ?? pair.caption ?? ""}
                            onChange={(e) => handleReplaceCaption(index, e.target.value)}
                          />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ✅ New pairs added in this session */}
            {newPairs.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-medium">New Pairs</p>
                {newPairs.map((pair, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2 border-blue-200 bg-blue-50">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-blue-600">New Pair {index + 1}</p>
                      <button onClick={() => handleRemoveNewPair(index)} className="text-red-400 hover:text-red-600">
                        <X size={14}/>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Before</p>
                        <img src={pair.beforePreview} className="w-full h-20 object-cover rounded-lg" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">After</p>
                        <img src={pair.afterPreview} className="w-full h-20 object-cover rounded-lg" />
                      </div>
                    </div>
                    {pair.caption && <p className="text-xs text-gray-500">📝 {pair.caption}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Add new pair form — only if total < 3 */}
            {totalPairs < 3 && (
              <div className="border border-dashed rounded-lg p-4 space-y-3">
                <p className="text-xs font-medium text-gray-600">
                  {existingPairs.length > 0 ? "Add More Pairs" : "Add New Pair"}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* Before */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Before *</p>
                    <div
                      onClick={() => document.getElementById("beforeImg").click()}
                      className="border rounded-lg h-20 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden"
                    >
                      {newPair.beforePreview ? (
                        <img src={newPair.beforePreview} className="w-full h-full object-cover" />
                      ) : (
                        <p className="text-xs text-gray-400">+ Before</p>
                      )}
                    </div>
                    <input id="beforeImg" type="file" accept="image/*" className="hidden"
                      onChange={(e) => handlePairImage(e, "before")} />
                  </div>

                  {/* After */}
                  <div>
                    <p className="text-xs text-gray-400 mb-1">After *</p>
                    <div
                      onClick={() => document.getElementById("afterImg").click()}
                      className="border rounded-lg h-20 flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden"
                    >
                      {newPair.afterPreview ? (
                        <img src={newPair.afterPreview} className="w-full h-full object-cover" />
                      ) : (
                        <p className="text-xs text-gray-400">+ After</p>
                      )}
                    </div>
                    <input id="afterImg" type="file" accept="image/*" className="hidden"
                      onChange={(e) => handlePairImage(e, "after")} />
                  </div>
                </div>

                {/* Caption */}
                <input type="text"
                  placeholder="Caption (optional)"
                  className="border rounded-lg p-2 w-full text-xs"
                  value={newPair.caption}
                  onChange={(e) => setNewPair(prev => ({ ...prev, caption: e.target.value }))} />

                <button onClick={handleAddNewPair}
                  className="w-full border border-blue-500 text-blue-600 text-xs py-1.5 rounded-lg hover:bg-blue-50">
                  + Add Pair
                </button>
              </div>
            )}

            {totalPairs >= 3 && (
              <p className="text-xs text-center text-gray-400">Maximum 3 pairs reached</p>
            )}

          </div>

          <button onClick={handleSubmit} disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {newPairs.length > 0 || Object.keys(replacedPairs).length > 0
                  ? "Uploading images..."
                  : isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Service" : "Create Service"
            )}
          </button>

        </div>
      </div>
    </>
  )
}