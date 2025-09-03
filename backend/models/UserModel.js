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
  },
  { timestamps: true }
);

// Create the model
const User = mongoose.model("User", UserSchema);

export default User;
