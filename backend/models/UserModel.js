import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    avatar: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function() {;
      },
    },
    provider: {
      type: String,
      enum: ["manual", "google", "github"],
      default: "manual",
    },
    githubToken: { type: String, select: false }, 
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model("User", UserSchema);

export default User;
