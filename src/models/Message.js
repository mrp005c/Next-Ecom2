// models/Product.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    name: { type: String},
    email: { type: String, required: true },
    message: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Avoid model overwrite issue in Next.js
export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
