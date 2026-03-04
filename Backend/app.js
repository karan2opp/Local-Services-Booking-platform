import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoute from "../Backend/routes/user.route.js"
import serviceProviderRoute from "../Backend/routes/serviceProvider.route.js"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json())

app.use(urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())





// Routes
app.use("/api/user",userRoute)
app.use("/api/serviceProvider",serviceProviderRoute)

export {app}