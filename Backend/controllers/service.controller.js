// controllers/service.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"
import { Service } from "../models/service.model.js"
import { Category } from "../models/category.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

export const searchServices = asyncHandler(async(req, res) => {

  const { category, city, area, page, limit } = req.query

  const pageNumber = parseInt(page) || 1
  const limitNumber = parseInt(limit) || 10
  const skip = (pageNumber - 1) * limitNumber

  const serviceQuery = {}

  if(category){
    const categoryDoc = await Category.findOne({ 
      name: { $regex: category, $options: "i" },
      isActive: true
    })
    if(!categoryDoc){
      throw new ApiError(404, `Category "${category}" not found`)
    }
    serviceQuery.categoryId = categoryDoc._id
  }

  const providerMatch = {
    status: "approved",
    isAvailable: true,
  }
  if(city){
    providerMatch["provideraddress.city"] = { $regex: city, $options: "i" }
  }
  if(area){
    providerMatch["provideraddress.area"] = { $regex: area, $options: "i" }
  }

  const totalServices = await Service.countDocuments(serviceQuery)

  const services = await Service.find(serviceQuery)
    .select("serviceName price image categoryId providerId serviceType description") // ✅ only needed fields
    .populate("categoryId", "name")           // ✅ only name
    .populate({
      path: "providerId",
      match: providerMatch,
      select: "rating experience userId",     // ✅ minimal provider data
      populate:{
        path: "userId",
        select: "username"                    // ✅ only username
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)

  const filteredServices = services.filter(s => s.providerId !== null)

  const totalPages = Math.ceil(totalServices / limitNumber)

  return res.status(200).json(
    new ApiResponse(200, {
      services: filteredServices,
      pagination:{
        totalServices,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      }
    },
    filteredServices.length === 0
      ? "No services found"
      : "Services fetched successfully"
    )
  )
})


export const getServiceById = asyncHandler(async(req, res) => {

  const { serviceId } = req.params

  const service = await Service.findById(serviceId)
    .populate("categoryId", "name description image isActive")  // ✅ full category
    .populate({
      path: "providerId",
      select: "provideraddress businessPhone rating experience isAvailable userId coverImage",
      populate:{
        path: "userId",
        select: "username email phone"   // ✅ full provider info
      }
    })

  if(!service){
    throw new ApiError(404, "Service not found")
  }

  // check category is active
  if(!service.categoryId.isActive){
    console.log(service.categoryId.isActive);
    
    throw new ApiError(400, "This service is no longer available")
  }

  return res.status(200).json(
    new ApiResponse(200, service, "Service fetched successfully")
  )
})