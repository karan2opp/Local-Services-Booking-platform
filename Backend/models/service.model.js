import mongoose from "mongoose"

const serviceSchema = new mongoose.Schema({
  providerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "serviceProvider",
    required: true
  },
  categoryId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  serviceName:{
    type: String,
    required: true,
    trim: true
  },
  description:{
    type: String,
    required: true,
    trim: true
  },
  price:{
    type: Number,
    required: true
  },
  serviceType:{
    type: String,
    enum: ["home", "store"],
    required: true
  },
  image:{
    type: [String],
    validate:{
      validator: function(arr){ return arr.length >= 1 },
      message: "At least one image is required"
    }
  }
}, { timestamps: true })
export const Service=mongoose.model("Service",serviceSchema)
