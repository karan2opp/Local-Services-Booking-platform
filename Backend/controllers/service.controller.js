// controllers/service.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"
import { Service } from "../models/service.model.js"
import { Category } from "../models/category.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const searchServices = asyncHandler(async(req, res) => {

  const { category, city, area } = req.query

  // build service query
  const serviceQuery = {}

  // filter by category if provided
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

  // build provider match query
  const providerMatch = {
    status: "approved",    // only approved providers
    isAvailable: true,     // only available providers
  }

  // add city filter if provided
  if(city){
    providerMatch["provideraddress.city"] = { 
      $regex: city, 
      $options: "i"  // case insensitive
    }
  }

  // add area filter if provided
  if(area){
    providerMatch["provideraddress.area"] = { 
      $regex: area, 
      $options: "i"  // case insensitive
    }
  }

  // fetch services with filters
  const services = await Service.find(serviceQuery)
    .populate("categoryId", "name description image")
    .populate({
      path: "providerId",
      match: providerMatch,
      select: "provideraddress businessPhone rating experience isAvailable",
      populate:{
        path: "userId",
        select: "username email phone"
      }
    })
    .sort({ createdAt: -1 })

  // filter out services where provider didnt match
  const filteredServices = services.filter(s => s.providerId !== null)

  // return empty array instead of error if no services
  // so frontend can show "no services found" message
  return res.status(200).json(
    new ApiResponse(
      200, 
      filteredServices, 
      filteredServices.length === 0 
        ? "No services found" 
        : "Services fetched successfully"
    )
  )
})