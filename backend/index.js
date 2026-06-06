import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import travelStoryRoutes from "./routes/travelStory.route.js"
import { fileURLToPath } from "url"

dotenv.config()

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  console.error("MONGO_URI is not defined. Please set it in backend/.env")
  process.exit(1)
}

mongoose
  .connect(mongoUri, {
    serverSelectionTimeoutMS: 30000,
    retryWrites: true,
    family: 4,
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(() => {
    console.log("Database is connected")
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err)
  })

mongoose.connection.on("error", (err) => {
  console.error("MongoDB runtime error:", err)
})

const app = express()

// Enable CORS for frontend (Replace with your frontend URL)
app.use(
  cors({
    origin: "http://localhost:5173", //frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow CRUD operations
    credentials: true, // Allow cookies & authorization headers
  })
)

app.use(cookieParser())

// for allowing json object in req body
app.use(express.json())

app.listen(8000, () => {
  console.log("Server is running on port 8000!")
})

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/travel-story", travelStoryRoutes)

// server static files from the uploads and assets directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/assets", express.static(path.join(__dirname, "assets")))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500

  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})
