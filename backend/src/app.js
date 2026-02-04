import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

app.use("/api/auth", await import("./routes/authRoutes.js"))
app.use("/api/logs", await import("./routes/logRoutes.js"))

app.listen(process.env.PORT)
