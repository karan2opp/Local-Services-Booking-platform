import { asyncHandler } from "../utils/asyncHandler.js"
import { serviceProvider } from "../models/serviceProvider.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// GET all pending providers
export const getPendingProviders = asyncHandler(async(req, res) => {


  const pendingProviders = await serviceProvider.find({ status: "pending" })
    .populate("userId", "username email phone")

  if(pendingProviders.length === 0){
    throw new ApiError(404, "No pending providers found")
  }

  return res.status(200).json(
    new ApiResponse(200, pendingProviders, "Pending providers fetched successfully")
  )
})

// GET all approved providers
export const getApprovedProviders = asyncHandler(async(req, res) => {

  const approvedProviders = await serviceProvider.find({ status: "approved" })
    .populate("userId", "username email phone")

  if(approvedProviders.length === 0){
    throw new ApiError(404, "No approved providers found")
  }

  return res.status(200).json(
    new ApiResponse(200, approvedProviders, "Approved providers fetched successfully")
  )
})

// GET all rejected providers
export const getRejectedProviders = asyncHandler(async(req, res) => {

  const rejectedProviders = await serviceProvider.find({ status: "rejected" })
    .populate("userId", "username email phone")

  if(rejectedProviders.length === 0){
    throw new ApiError(404, "No rejected providers found")
  }

  return res.status(200).json(
    new ApiResponse(200, rejectedProviders, "Rejected providers fetched successfully")
  )
})

// PATCH approve single provider
export const approveServiceProvider = asyncHandler(async(req, res) => {

  const { providerId } = req.params

  const provider = await serviceProvider.findById(providerId)
  if(!provider) throw new ApiError(404, "Provider not found")

  if(provider.status === "approved"){
    throw new ApiError(400, "Provider is already approved")
  }

  // approve + update role
  provider.status = "approved"
  await provider.save({ validateBeforeSave: false })

  await User.findByIdAndUpdate(
    provider.userId,
    { role: "serviceProvider" }
  )

  return res.status(200).json(
    new ApiResponse(200, provider, "Provider approved successfully")
  )
})

// PATCH reject single provider
export const rejectServiceProvider = asyncHandler(async(req, res) => {

  const { providerId } = req.params

  const provider = await serviceProvider.findById(providerId)
  if(!provider) throw new ApiError(404, "Provider not found")

  if(provider.status === "rejected"){
    throw new ApiError(400, "Provider is already rejected")
  }

  // reject + revert role back to customer
  provider.status = "rejected"
  await provider.save({ validateBeforeSave: false })

  await User.findByIdAndUpdate(
    provider.userId,
    { role: "customer" }
  )

  return res.status(200).json(
    new ApiResponse(200, provider, "Provider rejected successfully")
  )
})

// PATCH approve ALL pending providers
export const approveAllProviders = asyncHandler(async(req, res) => {

  const pendingProviders = await serviceProvider.find({ status: "pending" })
  if(pendingProviders.length === 0){
    throw new ApiError(400, "No pending providers found")
  }

  await serviceProvider.updateMany(
    { status: "pending" },
    { status: "approved" }
  )

  const userIds = pendingProviders.map(p => p.userId)
  await User.updateMany(
    { _id: { $in: userIds } },
    { role: "serviceProvider" }
  )

  return res.status(200).json(
    new ApiResponse(200, {}, `${pendingProviders.length} providers approved successfully`)
  )
})

// PATCH reject ALL pending providers
export const rejectAllPendingProviders = asyncHandler(async(req, res) => {

  const pendingProviders = await serviceProvider.find({ status: "pending" })
  if(pendingProviders.length === 0){
    throw new ApiError(400, "No pending providers found")
  }

  await serviceProvider.updateMany(
    { status: "pending" },
    { status: "rejected" }
  )

  // no role change needed
  // they were never approved so role is still "customer"

  return res.status(200).json(
    new ApiResponse(200, {}, `${pendingProviders.length} providers rejected successfully`)
  )
})

