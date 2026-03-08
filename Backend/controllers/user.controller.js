import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
 const registerUser= asyncHandler(async(req,res)=>{


    const {username,email,password,phone}=req.body;
    
    
    if([username,email,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }
     if(!phone){
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=await User.findOne(
        {
            $or:[{email},{username},{phone}]
        }
    )
     if(existedUser){
            throw new ApiError(409,"User with email , username or mobile already exist")
        }

     const user =await  User.create({
            username,
            email,
            password,
            phone

        })
        const createdUser=await User.findById(user._id).select( "-password  -refreshToken" )
        if(!createdUser)throw new ApiError(500,"Something went wrong while registering the user")
    return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Succesfully")
    )
})


const generateAccessAndRefreshToken = async (userId) => {
    
    
  if(!userId) throw new ApiError(400, "User ID is required")

  const user = await User.findById(userId)
  if(!user) throw new ApiError(404, "User not found")

  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })

  return { accessToken, refreshToken }
}


const loginUser = asyncHandler(async(req, res) => {

  const { email, password } = req.body
console.log(req.body);
  if(!email || !password){
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({ email })
  if(!user) throw new ApiError(404, "User does not exist")

  const isPasswordCorrect = await user.isPasswordCorrect(password)
  if(!isPasswordCorrect) throw new ApiError(401, "Invalid email or password")

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)
  
  

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  }
 
     
  return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken:accessToken,
      }, "User logged in successfully") // ✅ message inside constructor
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,{
    $set:{
        refreshToken:undefined
    }
  },{new:true})

    const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" // ✅ only secure in production
  }
  return res.status(200).
            clearCookie("accessToken",options).
            clearCookie("refreshToken",options).
            json(new ApiResponse(200,{},"User logout sucesfully"))
})

export { registerUser, loginUser,logoutUser }