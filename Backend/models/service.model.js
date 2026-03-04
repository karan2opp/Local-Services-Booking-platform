import mongoose from "mongoose";

const serviceSchema=new mongoose.Schema({
    serviceName:{
        type:String,
        required:true,

    },
    description:{
        type:String,
        required:true,

    },
    basePrice:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
  enum:["AC-Service","Plumbing","Saloon"]

    },

image: {
  type: [String],   
  validate: {
    validator: function(arr) {
      return arr.length >= 1  
    },
    message: "At least one image is required"
  }
}
  
})
export const Service=mongoose.model("Service",serviceSchema)