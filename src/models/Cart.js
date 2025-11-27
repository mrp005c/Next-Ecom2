import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    email: { type: String, required: true },
    products: [
      {
        cartP: { type: mongoose.Schema.Types.ObjectId, auto: true },
        name: String,
        image: [String],
        price: Number,
        category: String,
        rating: Number,
        inStock: Boolean,
        productId: Number,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
