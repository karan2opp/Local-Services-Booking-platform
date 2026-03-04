import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        minlength: [3, "Username must be at least 3 characters"],
        maxlength: [20, "Username cannot exceed 20 characters"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
         lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:true,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [128, "Password cannot exceed 128 characters"],

    },
    phone:{
  type: String,
  required: true,
  unique: true,
  trim: true,
  match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
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
},
   

role:{
    type:String,
    enum:["customer","serviceProvider","admin"],
    default: "customer",  
    required: true,
},
refreshToken:{
    type:String,
}

},{
    timestamps:true
})
userSchema.pre("save",async function(){
    if(!this.isModified("password"))return 
 this.password=await bcrypt.hash(this.password,10)

})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
   return  jwt.sign({
  _id: this._id,
   email:this.email,
username:this.username
}, process.env.ACCESS_TOKEN_SECRET, { // ← comma here
  expiresIn: process.env.ACCESS_TOKEN_EXPIRY
})
    
}
userSchema.methods.generateRefreshToken= function(){
    return  jwt.sign({
        _id: this._id,
        
    },process.env.REFRESH_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const User=mongoose.model("User",userSchema)