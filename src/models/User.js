import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: { type: String },
    address: { type: String },
    image: String,
    password: {
      type: String,
      min: [6, "Must be at least 11, got {VALUE}"],
      max: [10, "Max 11 character, got {VALUE}"],
    },
    role: { type: String, default: "user" }, // 'admin' or 'user'
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
