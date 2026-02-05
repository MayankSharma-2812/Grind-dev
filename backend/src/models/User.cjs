const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    githubUsername: String,
    lastSyncedCommitSha: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
