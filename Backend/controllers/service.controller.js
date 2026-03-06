// controllers/service.controller.js
import { asyncHandler } from "../utils/asyncHandler.js"
import { Service } from "../models/service.model.js"
import { Category } from "../models/category.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

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
    providerMatch["provideraddress.city"] = { 
      $regex: city, 
      $options: "i"
    }
  }

  if(area){
    providerMatch["provideraddress.area"] = { 
      $regex: area, 
      $options: "i"
    }
  }

  
  const totalServices = await Service.countDocuments(serviceQuery)

  
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
    .skip(skip)        
    .limit(limitNumber) 

  
  const filteredServices = services.filter(s => s.providerId !== null)

  
  const totalPages = Math.ceil(totalServices / limitNumber)
  const hasNextPage = pageNumber < totalPages
  const hasPrevPage = pageNumber > 1

  return res.status(200).json(
    new ApiResponse(200, {
      services: filteredServices,
      pagination:{
        totalServices,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
        hasNextPage,
        hasPrevPage
      }
    },
    filteredServices.length === 0
      ? "No services found"
      : "Services fetched successfully"
    )
  )
})
