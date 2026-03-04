// middlewares/isApprovedProvider.middleware.js
import { ApiError } from "../utils/ApiError.js"
import { serviceProvider } from "../models/serviceProvider.model.js"

export const isApprovedProvider = async (req, res, next) => {
  try {

    // check role first
    if(req.user.role !== "serviceProvider"){
      throw new ApiError(403, "Access denied! Service providers only")
    }
    
    

    // check if approved
    const provider = await serviceProvider.findOne({ userId: req.user._id })

    if(!provider){
      throw new ApiError(404, "Service provider profile not found")
    }

    if(provider.status !== "approved"){
      throw new ApiError(403, "Your account is not approved yet!")
    }

    // attach provider to req for use in controllers
    req.provider = provider
    next()

  } catch(error) {
    next(error)
  }
}

