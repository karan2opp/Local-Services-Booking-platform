import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema({
   customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   serviceProviderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"serviceProvider",
    required:true
   },
   serviceId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Service",
    required:true
   },
   status:{
    type:String,
    default:"pending",
    enum:["pending","inProgress","confirmed","completed","cancelled"]
   },
   notes:{
       type:[],

   },
   scheduledDate:{ type: Date, required: true },
})

export const myBookings=mongoose.model("myBookings",bookingSchema)