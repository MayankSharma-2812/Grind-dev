const mongoose = require("mongoose");

const ProblemLogSchema = new mongoose.Schema(
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
);

module.exports = mongoose.model("ProblemLog", ProblemLogSchema);
