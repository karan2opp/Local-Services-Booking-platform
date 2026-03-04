import mongoose from "mongoose"


const customerSchema=new mongoose.Schema({
     userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true  
  },
    addresses: [
    {
       label: String,   // "Home", "Office", "Other"
       street: String,
       city: String,
       area: String,
       state: String,
       pincode: String,
       isDefault: Boolean , // which address to use by default
    }
                ],
    savedServices:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],
cart:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Cart"
}

},{
    timestamps:true
})


export const Customer=mongoose.model("Customer",customerSchema)