import mongoose from "mongoose"

const serviceProviderSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  services:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],
  provideraddress:{
    street: String,
    city: String,
    area: String,
    state: String,
    pincode: String,
  },
  businessPhone:{
    type: String,
    unique: true,
    required:true,
    trim: true,
    match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
  },
  rating:{
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0"],  // ✅
    max: [5, "Rating cannot be more than 5"]   // ✅
  },
  experience:{
    type: Number,  
    default:0,      // ✅ Number not String
    min: [0, "Experience cannot be negative"]
  },
  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
  isAvailable:{
    type: Boolean,
    default: false
  },
  coverImage:{
    type: String,

  }
},{ timestamps: true }) 
export const serviceProvider=mongoose.model("serviceProvider",serviceProviderSchema)