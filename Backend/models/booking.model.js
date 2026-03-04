import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
  customerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  serviceProviderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceProvider",
    required: true
  },
  serviceId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  status:{
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "inProgress", "completed", "cancelled"]
  },
  notes:{ type: String },  // ✅ String not array
  scheduledDate:{ type: Date, required: true },
  price:{ type: Number, required: true },  // ✅ snapshot price
  serviceType:{
    type: String,
    enum: ["home", "store"]  // ✅ from service
  },
  address:{                  // ✅ snapshot address
    street: String,
    city: String,
    area: String,
    state: String,
    pincode: String
  }
}, { timestamps: true })

export const Booking = mongoose.model("Booking", bookingSchema)