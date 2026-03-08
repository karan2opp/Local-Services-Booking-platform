import { asyncHandler } from "../utils/asyncHandler.js"
import { serviceProvider } from "../models/serviceProvider.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Service } from "../models/service.model.js"
import { Category } from "../models/category.model.js"
import { Booking } from "../models/booking.model.js"
import { uploadOnCloudinary } from "../cloudinary.js"


export const registerAsProvider = asyncHandler(async(req, res) => {

  const existingProvider = await serviceProvider.findOne({ 
    userId: req.user._id 
  })
  if(existingProvider){
    throw new ApiError(400, "You have already submitted a request")
  }

  const { experience, businessPhone, street, city, area, state, pincode } = req.body

  if(!experience || !businessPhone || !city){
    throw new ApiError(400, "experience, businessPhone and city are required")
  }

  const provider = await serviceProvider.create({
    userId: req.user._id,
    experience,
    businessPhone,
    provideraddress: {
      street: street || "",
      city,
      area: area || "",
      state: state || "",
      pincode: pincode || ""
    },
    status: "pending"
  })

  return res.status(201).json(
    new ApiResponse(201, provider, "Request submitted! Waiting for admin approval")
  )
})

export const createService = asyncHandler(async(req, res) => {

  const { serviceName, description, price, categoryId, serviceType } = req.body

  if(!serviceName || !description || !price || !categoryId || !serviceType){
    throw new ApiError(400, "All fields are required")
  }

  // check category exists and is active
  const category = await Category.findById(categoryId)
  if(!category){
    throw new ApiError(404, "Category not found")
  }
  if(!category.isActive){
    throw new ApiError(400, "This category is no longer active")
  }

  // check duplicate service by same provider
  const existingService = await Service.findOne({
    serviceName,
    providerId: req.provider._id
  })
  if(existingService){
    throw new ApiError(409, "You already have a service with this name")
  }

  // handle single cover image
  if(!req.file){
    throw new ApiError(400, "Cover image is required")
  }

  const uploadedImage = await uploadOnCloudinary(req.file.path)
  if(!uploadedImage){
    throw new ApiError(500, "Image upload failed")
  }

  const service = await Service.create({
    providerId: req.provider._id,
    categoryId,
    serviceName,
    description,
    price: Number(price),
    serviceType,
    image: uploadedImage.url  // ✅ single string
  })

  // push service id into provider's services array
  await serviceProvider.findByIdAndUpdate(
    req.provider._id,
    { $push: { services: service._id } }
  )

  return res.status(201).json(
    new ApiResponse(201, service, "Service created successfully")
  )
})

export const updateService = asyncHandler(async(req, res) => {

  const { serviceId } = req.params
  const { serviceName, description, price, categoryId, serviceType } = req.body

  // check service exists
  const service = await Service.findById(serviceId)
  if(!service){
    throw new ApiError(404, "Service not found")
  }

  // check service belongs to this provider
  if(service.providerId.toString() !== req.provider._id.toString()){
    throw new ApiError(403, "You can only update your own services")
  }

  // check category if updating
  if(categoryId){
    const category = await Category.findById(categoryId)
    if(!category){
      throw new ApiError(404, "Category not found")
    }
    if(!category.isActive){
      throw new ApiError(400, "This category is no longer active")
    }
  }

  // check no active bookings before updating serviceType
  if(serviceType && serviceType !== service.serviceType){
    const activeBookings = await Booking.findOne({
      serviceId,
      status: { $in: ["pending", "confirmed", "inProgress"] }
    })
    if(activeBookings){
      throw new ApiError(400, "Cannot change service type with active bookings")
    }
  }

  // handle cover image update
  let imageUrl = service.image  // keep existing by default
  if(req.file){
    const uploaded = await uploadOnCloudinary(req.file.path)
    imageUrl = uploaded?.url || service.image
  }

  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    {
      serviceName: serviceName || service.serviceName,
      description: description || service.description,
      price: price ? Number(price) : service.price,
      categoryId: categoryId || service.categoryId,
      serviceType: serviceType || service.serviceType,
      image: imageUrl  // ✅ single string
    },
    { new: true }
  )

  return res.status(200).json(
    new ApiResponse(200, updatedService, "Service updated successfully")
  )
})



export const updateServicePortfolio = asyncHandler(async (req, res) => {

  const { serviceId } = req.params

  const service = await Service.findById(serviceId)
  if (!service) throw new ApiError(404, "Service not found")

  if (service.providerId.toString() !== req.provider._id.toString()) {
    throw new ApiError(403, "You can only update your own services")
  }

  let pairs = [...service.beforeAfterImages]

  // Step 1: Delete marked pairs
  const deleteIndexes = []
  if (req.body.deletePairIndex) {
    const raw = Array.isArray(req.body.deletePairIndex)
      ? req.body.deletePairIndex
      : [req.body.deletePairIndex]
    raw.forEach(i => deleteIndexes.push(Number(i)))
  }
  deleteIndexes.sort((a, b) => b - a).forEach(i => {
    if (i >= 0 && i < pairs.length) pairs.splice(i, 1)
  })

  // Collect all upload tasks
  const replaceIndexKeys = Object.keys(req.body).filter(k => k.startsWith("replaceIndex_"))
  const beforeNewFiles   = (req.files || []).filter(f => /^before_\d+$/.test(f.fieldname))
  const afterNewFiles    = (req.files || []).filter(f => /^after_\d+$/.test(f.fieldname))

  if (beforeNewFiles.length !== afterNewFiles.length) {
    throw new ApiError(400, "Each new before image must have a matching after image")
  }

  if (pairs.length + beforeNewFiles.length > 3) {
    throw new ApiError(400,
      `You can only have 3 pairs total. Currently have ${pairs.length}, trying to add ${beforeNewFiles.length}`
    )
  }

  // Build replacement upload tasks
  const replaceTasks = replaceIndexKeys.map(key => {
    const existingIndex = Number(req.body[key])
    const deletedBefore = deleteIndexes.filter(d => d < existingIndex).length
    const newIndex = existingIndex - deletedBefore
    const suffix = key.replace("replaceIndex_", "")

    const beforeFile = req.files?.find(f => f.fieldname === `replaceBefore_${suffix}`)
    const afterFile  = req.files?.find(f => f.fieldname === `replaceAfter_${suffix}`)

    return {
      newIndex,
      suffix,
      beforeUpload: beforeFile ? uploadOnCloudinary(beforeFile.path) : Promise.resolve(null),
      afterUpload:  afterFile  ? uploadOnCloudinary(afterFile.path)  : Promise.resolve(null),
    }
  })

  // Build new pair upload tasks
  const newPairTasks = beforeNewFiles.map((_, i) => ({
    i,
    beforeUpload: uploadOnCloudinary(beforeNewFiles[i].path),
    afterUpload:  uploadOnCloudinary(afterNewFiles[i].path),
  }))

  // Fire ALL Cloudinary uploads in parallel
  await Promise.all([
    ...replaceTasks.flatMap(t => [t.beforeUpload, t.afterUpload]),
    ...newPairTasks.flatMap(t => [t.beforeUpload, t.afterUpload]),
  ])

  // Apply replacement results
  for (const task of replaceTasks) {
    const { newIndex, suffix } = task
    if (newIndex < 0 || newIndex >= pairs.length) continue

    const beforeResult = await task.beforeUpload
    const afterResult  = await task.afterUpload

    pairs[newIndex] = {
      before:  beforeResult?.url || req.body[`replaceBeforeUrl_${suffix}`] || pairs[newIndex].before,
      after:   afterResult?.url  || req.body[`replaceAfterUrl_${suffix}`]  || pairs[newIndex].after,
      caption: req.body[`replaceCaption_${suffix}`] ?? pairs[newIndex].caption ?? ""
    }
  }

  // Apply new pair results
  for (const task of newPairTasks) {
    const beforeResult = await task.beforeUpload
    const afterResult  = await task.afterUpload

    if (!beforeResult || !afterResult) {
      throw new ApiError(500, `Failed to upload new pair ${task.i + 1}`)
    }

    pairs.push({
      before:  beforeResult.url,
      after:   afterResult.url,
      caption: req.body[`caption_${task.i}`] || ""
    })
  }

  // Save
  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    { $set: { beforeAfterImages: pairs } },
    { new: true }
  )

  return res.status(200).json(
    new ApiResponse(200, updatedService, "Portfolio updated successfully")
  )
})
export const deleteService = asyncHandler(async(req, res) => {

  const { serviceId } = req.params

  const service = await Service.findById(serviceId)
  if(!service){
    throw new ApiError(404, "Service not found")
  }

  if(service.providerId.toString() !== req.provider._id.toString()){
    throw new ApiError(403, "You can only delete your own services")
  }

  const activeBookings = await Booking.findOne({
    serviceId,
    status: { $in: ["pending", "confirmed", "inProgress"] }
  })
  if(activeBookings){
    throw new ApiError(400, "Cannot delete service with active bookings")
  }

  await Service.findByIdAndDelete(serviceId)

  // ✅ remove from provider's services array
  await serviceProvider.findByIdAndUpdate(
    req.provider._id,
    { $pull: { services: serviceId } }
  )

  return res.status(200).json(
    new ApiResponse(200, {}, "Service deleted successfully")
  )
})

export const getMyProviderStatus = asyncHandler(async(req, res) => {
  const provider = await serviceProvider.findOne({ userId: req.user._id })

  return res.status(200).json(
    new ApiResponse(200, {
      status: provider ? provider.status : "notApplied"
    }, "Status fetched")
  )
})

export const getMyServices = asyncHandler(async(req, res) => {

  const provider = await serviceProvider.findOne({ userId: req.user._id })
  if(!provider){
    throw new ApiError(404, "Provider profile not found")
  }

  const services = await Service.find({ providerId: provider._id })
    .populate("categoryId", "name image")         // ✅ categoryId.name
    .populate({
      path: "providerId",
      select: "rating userId",                    // ✅ rating
      populate:{
        path: "userId",
        select: "username"                        // ✅ username
      }
    })
    .sort({ createdAt: -1 })

  return res.status(200).json(
    new ApiResponse(200, services, "Services fetched successfully")
  )
})

// getMyProfile controller
export const getMyProfile = asyncHandler(async(req, res) => {
  const provider = await serviceProvider.findOne({ userId: req.user._id })
  if(!provider) throw new ApiError(404, "Provider profile not found")

  return res.status(200).json(
    new ApiResponse(200, provider, "Profile fetched successfully")
  )
})

// updateMyProfile controller
export const updateMyProfile = asyncHandler(async(req, res) => {
  const { businessPhone, experience, street, city, area, state, pincode } = req.body

  const provider = await serviceProvider.findOne({ userId: req.user._id })
  if(!provider) throw new ApiError(404, "Provider profile not found")

  const updated = await serviceProvider.findByIdAndUpdate(
    provider._id,
    {
      businessPhone: businessPhone || provider.businessPhone,
      experience: experience || provider.experience,
      provideraddress: {
        street: street || provider.provideraddress?.street,
        city: city || provider.provideraddress?.city,
        area: area || provider.provideraddress?.area,
        state: state || provider.provideraddress?.state,
        pincode: pincode || provider.provideraddress?.pincode,
      }
    },
    { new: true }
  )

  return res.status(200).json(
    new ApiResponse(200, updated, "Profile updated successfully")
  )
})