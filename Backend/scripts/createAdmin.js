import mongoose from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"

dotenv.config()

const createAdmin = async () => {
  try {
    // connect directly
    await mongoose.connect(`${process.env.MONGODB_URL}`)
    console.log("✅ DB connected!")

    // define schema directly in script
    const userSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      phone: String,
      role: String
    })

    // get existing model or create new one
    const User = mongoose.models.User || mongoose.model("User", userSchema)

    // check if admin exists
    const existingAdmin = await User.findOne({ role: "admin" })
    if(existingAdmin){
      console.log("⚠️ Admin already exists!")
      console.log("📧 Email:", existingAdmin.email)
      process.exit(0)
    }

    // hash password manually
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // create admin
    const admin = await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "9999999999",
      role: "admin"
    })


    process.exit(0)

  } catch(error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createAdmin()