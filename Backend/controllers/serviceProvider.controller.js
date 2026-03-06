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

  const { experience, businessPhone, provideraddress } = req.body

  const provider = await serviceProvider.create({
    userId: req.user._id,
    experience,
    businessPhone,
    provideraddress,
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



export const updateServicePortfolio = asyncHandler(async(req, res) => {

  const { serviceId } = req.params

  const service = await Service.findById(serviceId)
  if(!service){
    throw new ApiError(404, "Service not found")
  }

  if(service.providerId.toString() !== req.provider._id.toString()){
    throw new ApiError(403, "You can only update your own services")
  }

  if(!req.files){
    throw new ApiError(400, "Images are required")
  }

  const beforeFiles = req.files.filter(f => f.fieldname.startsWith("before"))
  const afterFiles = req.files.filter(f => f.fieldname.startsWith("after"))

  if(beforeFiles.length === 0 || afterFiles.length === 0){
    throw new ApiError(400, "Both before and after images are required")
  }

  if(beforeFiles.length !== afterFiles.length){
    throw new ApiError(400, "Each before image must have a matching after image")
  }

  // ✅ check max 3 pairs
  const existingPairs = service.beforeAfterImages.length
  const newPairs = beforeFiles.length

  if(existingPairs >= 3){
    throw new ApiError(400, "You already have 3 pairs. Cannot add more!")
  }

  if(existingPairs + newPairs > 3){
    throw new ApiError(400, 
      `You have ${existingPairs} pair(s) already. You can only add ${3 - existingPairs} more`
    )
  }

  const uploadPromises = [
    ...beforeFiles.map(f => uploadOnCloudinary(f.path)),
    ...afterFiles.map(f => uploadOnCloudinary(f.path))
  ]
  const results = await Promise.allSettled(uploadPromises)

  const beforeUrls = results
    .slice(0, beforeFiles.length)
    .filter(r => r.status === "fulfilled" && r.value)
    .map(r => r.value.url)

  const afterUrls = results
    .slice(beforeFiles.length)
    .filter(r => r.status === "fulfilled" && r.value)
    .map(r => r.value.url)

  const pairs = beforeUrls.map((beforeUrl, index) => ({
    before: beforeUrl,
    after: afterUrls[index],
    caption: req.body[`caption_${index}`] || ""
  }))

  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    { $push: { beforeAfterImages: { $each: pairs } } },
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
