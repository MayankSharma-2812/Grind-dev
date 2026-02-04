import mongoose from "mongoose"

export default mongoose.model(
  "ProblemLog",
  new mongoose.Schema(
    {
      userId: mongoose.Schema.Types.ObjectId,
      platform: String,
      title: String,
      difficulty: String,
      topic: String,
      notes: String,
      date: Date
    },
    { timestamps: true }
  )
)
