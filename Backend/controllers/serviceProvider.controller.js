import { asyncHandler } from "../utils/asyncHandler.js"
import { serviceProvider } from "../models/serviceProvider.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const registerAsProvider = asyncHandler(async(req, res) => {

  // check if already submitted request
  const existingProvider = await serviceProvider.findOne({ 
    userId: req.user._id 
  })
  if(existingProvider){
    throw new ApiError(400, "You have already submitted a request")
  }

  const { experience, businessPhone, address } = req.body

  const provider = await serviceProvider.create({
    userId: req.user._id,
    experience,
    businessPhone,
    address,
    services:[],
    isApproved: false  
  })

  return res.status(201).json(
    new ApiResponse(201, provider, "Request submitted! Waiting for admin approval")
  )
})