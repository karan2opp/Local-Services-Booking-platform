import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description:{
    type: String,
    trim: true
  },
  image:{
    type: String,
  },
   isActive:{
    type: Boolean,
    default: true  // ✅ active by default
  }
}, { timestamps: true })

export const Category = mongoose.model("Category", categorySchema)