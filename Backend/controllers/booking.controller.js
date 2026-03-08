import { asyncHandler } from "../utils/asyncHandler.js"
import { Booking } from "../models/booking.model.js"
import { Service } from "../models/service.model.js"
import { serviceProvider } from "../models/serviceProvider.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/apiResponse.js"

export const createBooking = asyncHandler(async(req, res) => {

  const customerId = req.user._id

  const { 
    serviceProviderId, 
    serviceId,          
    scheduledDate,      
    notes,
    address
  } = req.body

  // validate required fields
  if(!serviceProviderId || !serviceId || !scheduledDate){
    throw new ApiError(400, "All fields are required")
  }

  // validate date not in past
  const scheduled = new Date(scheduledDate)
  if(scheduled < new Date()){
    throw new ApiError(400, "Scheduled date cannot be in the past")
  }

  // check service exists + populate category
  const service = await Service.findById(serviceId).populate("categoryId")
  if(!service){
    throw new ApiError(404, "Service not found")
  }

  // ✅ check category is active
  if(!service.categoryId.isActive){
    throw new ApiError(400, "This service category is no longer available")
  }

  // check provider exists
  const provider = await serviceProvider.findById(serviceProviderId)
  if(!provider){
    throw new ApiError(404, "Service provider not found")
  }

  // check provider is approved
  if(provider.status !== "approved"){
    throw new ApiError(400, "Service provider is not approved")
  }

  // check provider is available
  if(!provider.isAvailable){
    throw new ApiError(400, "Service provider is not available")
  }

  // check provider not booking own service
  if(provider.userId.toString() === customerId.toString()){
    throw new ApiError(400, "You cannot book your own service")
  }

  // determine address based on service type
  let bookingAddress
  if(service.serviceType === "home"){
    if(!address){
      throw new ApiError(400, "Please provide your address for home service")
    }
    bookingAddress = address
  } else {
    bookingAddress = provider.provideraddress
  }

  // create booking
  const booking = await Booking.create({
    customerId,
    serviceProviderId,
    serviceId,
    scheduledDate: scheduled,
    notes,
    price: service.price,
    serviceType: service.serviceType,
    address: bookingAddress,
    status: "pending"
  })

  // populate for response
  const populatedBooking = await Booking.findById(booking._id)
    .populate("customerId", "username email phone")
    .populate("serviceProviderId", "userId businessPhone provideraddress")
    .populate("serviceId", "serviceName price categoryId serviceType") // ✅ fixed

  return res.status(201).json(
    new ApiResponse(201, populatedBooking, "Booking created successfully")
  )
})

export const updateBooking = asyncHandler(async(req, res) => {

  const { bookingId } = req.params
  const { scheduledDate, notes, address } = req.body

  const booking = await Booking.findById(bookingId)
  if(!booking){
    throw new ApiError(404, "Booking not found")
  }

  // check booking belongs to this customer
  if(booking.customerId.toString() !== req.user._id.toString()){
    throw new ApiError(403, "You can only update your own bookings")
  }

  // can only update pending or confirmed bookings
  if(!["pending", "confirmed"].includes(booking.status)){
    throw new ApiError(400, 
      `Cannot update booking with status "${booking.status}"`)
  }

  // validate new date if provided
  if(scheduledDate){
    const newDate = new Date(scheduledDate)
    if(newDate < new Date()){
      throw new ApiError(400, "Scheduled date cannot be in the past")
    }
    booking.scheduledDate = newDate
  }

  // update notes if provided
  if(notes) booking.notes = notes

  // update address if provided
  if(address) booking.address = address

  await booking.save({ validateBeforeSave: false })

  return res.status(200).json(
    new ApiResponse(200, booking, "Booking updated successfully")
  )
})

export const cancelBooking = asyncHandler(async(req, res) => {

  const { bookingId } = req.params

  const booking = await Booking.findById(bookingId)
  if(!booking){
    throw new ApiError(404, "Booking not found")
  }

  // check who is cancelling
  const isCustomer = booking.customerId.toString() === req.user._id.toString()
  const isProvider = booking.serviceProviderId.toString() === req.user._id.toString()

  // must be either customer or provider of this booking
  if(!isCustomer && !isProvider){
    throw new ApiError(403, "You are not authorized to cancel this booking")
  }

  // can only cancel pending or confirmed
  if(!["pending", "confirmed"].includes(booking.status)){
    throw new ApiError(400, 
      `Cannot cancel booking with status "${booking.status}"`)
  }

  booking.status = "cancelled"
  await booking.save({ validateBeforeSave: false })

  return res.status(200).json(
    new ApiResponse(200, booking, "Booking cancelled successfully")
  )
})

// UPDATE BOOKING STATUS (provider only)
export const updateBookingStatus = asyncHandler(async(req, res) => {

  const { bookingId } = req.params
  const { status } = req.body

  if(!status){
    throw new ApiError(400, "Status is required")
  }

  const booking = await Booking.findById(bookingId)
  if(!booking){
    throw new ApiError(404, "Booking not found")
  }

  // check booking belongs to this provider
if(booking.serviceProviderId.toString() !== req.provider._id.toString()){
  throw new ApiError(403, "You are not authorized to update this booking")
}

  // valid status transitions for provider
  const validTransitions = {
    pending:    ["confirmed", "cancelled"],  // provider accepts or rejects
    confirmed:  ["inProgress", "cancelled"], // provider starts or cancels
    inProgress: ["completed"],               // provider completes
    completed:  [],                          // final state
    cancelled:  []                           // final state
  }

  const allowedStatuses = validTransitions[booking.status]
  if(!allowedStatuses.includes(status)){
    throw new ApiError(400, 
      `Cannot change status from "${booking.status}" to "${status}"`)
  }

  booking.status = status
  await booking.save({ validateBeforeSave: false })

  // populate for response
  const updatedBooking = await Booking.findById(bookingId)
    .populate("customerId", "username email phone")
    .populate("serviceId", "serviceName price")

  return res.status(200).json(
    new ApiResponse(200, updatedBooking, 
      `Booking ${status} successfully`
    )
  )
})


// GET MY BOOKINGS (customer)
export const getMyBookings = asyncHandler(async(req, res) => {

  const customerId = req.user._id
  const { status } = req.query

  const query = { customerId }
  if(status) query.status = status

  const bookings = await Booking.find(query)
    .populate("serviceId", "serviceName price serviceType image")  // ✅ add image
    .populate({
      path: "serviceProviderId",
      select: "userId businessPhone provideraddress",
      populate:{
        path: "userId",
        select: "username email phone"
      }
    })
    .sort({ createdAt: -1 })

  // ✅ return empty array instead of throwing error
  return res.status(200).json(
    new ApiResponse(200, bookings, "Bookings fetched successfully")
  )
})

// GET BOOKINGS TO SERVE (provider)
export const getProviderBookings = asyncHandler(async(req, res) => {

  const { status } = req.query

  const provider = await serviceProvider.findOne({ userId: req.user._id })
  if(!provider){
    throw new ApiError(404, "Provider profile not found")
  }

  const query = { serviceProviderId: provider._id }
  if(status) query.status = status

  const bookings = await Booking.find(query)
    .populate("serviceId", "serviceName price serviceType image")  // ✅ add image
    .populate("customerId", "username email phone")                // ✅ removed addresses (not needed here)
    .sort({ createdAt: -1 })

  // ✅ just return empty array, no error
  return res.status(200).json(
    new ApiResponse(200, bookings, "Bookings fetched successfully")
  )
})