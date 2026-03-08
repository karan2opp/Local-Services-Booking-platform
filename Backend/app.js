import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoute from "../Backend/routes/user.route.js"
import serviceProviderRoute from "../Backend/routes/serviceProvider.route.js"
import adminRoute from "../Backend/routes/admin.route.js"
import bookingRoute from "../Backend/routes/booking.route.js"
import serviceRoute from "./routes/service.route.js"
const app=express()
app.set("trust proxy", 1)

const corsOrigins = process.env.CORS_ORIGIN.split(",")

app.use(cors({
  origin: corsOrigins,
  credentials: true
}))
app.use(express.json())

app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())





// Routes
app.use("/api/user",userRoute)
app.use("/api/serviceProvider",serviceProviderRoute)
app.use("/api/admin",adminRoute)
app.use("/api/booking",bookingRoute)
app.use("/api/service", serviceRoute)

export {app}