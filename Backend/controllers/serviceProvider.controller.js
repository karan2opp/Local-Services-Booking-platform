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

  // validate fields
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

  // handle images
  const imageFiles = req.files
  if(!imageFiles || imageFiles.length === 0){
    throw new ApiError(400, "At least one image is required")
  }

  const uploadPromises = imageFiles.map(file => uploadOnCloudinary(file.path))
  const results = await Promise.allSettled(uploadPromises)

  const imageUrls = results
    .filter(result => result.status === "fulfilled" && result.value)
    .map(result => result.value.url)

  const failedUploads = results.filter(result => result.status === "rejected")
  if(failedUploads.length > 0){
    console.log(`${failedUploads.length} images failed to upload`)
  }

  if(imageUrls.length === 0){
    throw new ApiError(500, "All image uploads failed")
  }

  const service = await Service.create({
    providerId: req.provider._id,  // ✅ from isApprovedProvider middleware
    categoryId,                     // ✅ updated
    serviceName,
    description,
    price: Number(price),           // ✅ updated from basePrice
    serviceType,
    image: imageUrls
  })

  return res.status(201).json(
    new ApiResponse(201, service, "Service created successfully")
  )
})

export const updateService = asyncHandler(async(req, res) => {

  const { serviceId } = req.params
  const { serviceName, description, price, categoryId, existingImages, serviceType } = req.body  // ✅ updated

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

  // handle images
  let imageUrls = []
  if(existingImages){
    imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages]
  }

  if(req.files && req.files.length > 0){
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path))
    const results = await Promise.allSettled(uploadPromises)
    const newImageUrls = results
      .filter(result => result.status === "fulfilled" && result.value)
      .map(result => result.value.url)
    imageUrls = [...imageUrls, ...newImageUrls]
  }

  if(imageUrls.length === 0){
    imageUrls = service.image
  }

  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    {
      serviceName: serviceName || service.serviceName,
      description: description || service.description,
      price: price ? Number(price) : service.price,        // ✅ updated
      categoryId: categoryId || service.categoryId,        // ✅ updated
      image: imageUrls,
      serviceType: serviceType || service.serviceType
    },
    { new: true }
  )

  return res.status(200).json(
    new ApiResponse(200, updatedService, "Service updated successfully")
  )
})

export const deleteService = asyncHandler(async(req, res) => {

  const { serviceId } = req.params

  const service = await Service.findById(serviceId)
  if(!service){
    throw new ApiError(404, "Service not found")
  }

  // check service belongs to this provider
  if(service.providerId.toString() !== req.provider._id.toString()){
    throw new ApiError(403, "You can only delete your own services")
  }

  // check no active bookings
  const activeBookings = await Booking.findOne({
    serviceId,
    status: { $in: ["pending", "confirmed", "inProgress"] }
  })
  if(activeBookings){
    throw new ApiError(400, "Cannot delete service with active bookings")
  }

  await Service.findByIdAndDelete(serviceId)

  return res.status(200).json(
    new ApiResponse(200, {}, "Service deleted successfully")
  )
})

