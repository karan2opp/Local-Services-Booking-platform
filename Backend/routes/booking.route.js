// routes/booking.route.js
import express from "express"
import { verifyJwt } from "../middlewares/auth.middleware.js"
import {
  createBooking,
  updateBooking,
  cancelBooking,
  updateBookingStatus,
  getMyBookings,
  getProviderBookings
} from "../controllers/booking.controller.js"
import { isApprovedProvider } from "../middlewares/isServiceProvider.middleware.js"

const router = express.Router()

// customer routes
router.route("/createBooking").post(verifyJwt, createBooking)
router.route("/updateBooking/:bookingId").patch(verifyJwt, updateBooking)
router.route("/cancelBooking/:bookingId").patch(verifyJwt, cancelBooking)
router.route("/myBookings").get(verifyJwt, getMyBookings)

// provider routes
router.route("/updateStatus/:bookingId").patch(verifyJwt,isApprovedProvider,updateBookingStatus)
router.route("/providerBookings").get(verifyJwt,isApprovedProvider, getProviderBookings)

export default router