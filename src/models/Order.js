// models/Product.js
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: String,
    name: String,
    email: { type: String, required: true },
    phone: {
      type: String,
      minLength: [9, "Must be at least 9, got {VALUE}"],
      maxLength: 15,
      required: true,
    },
    total: Number,
    paymentId: String,
    address: { type: String, required: true },
    products: { type: Array, min: 1 },
    status: { type: String, default: "pending" },
    paid: { type: Boolean, default: false },
    paidAt: Date,
  },
  { timestamps: true }
);

// Avoid model overwrite issue in Next.js
export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
