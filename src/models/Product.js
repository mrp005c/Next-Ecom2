// models/Product.js
import mongoose from "mongoose";

// const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: [String],
    price: { type: Number, required: true },
    category: { type: String, default: "uncategorized" },
    rating: Number,
    inStock: { type: Boolean, default: false },
    productId: { type: Number, unique: true, required: true },
  },
  { timestamps: true }
);

// Apply the plugin to the schema
// ProductSchema.plugin(AutoIncrement, { inc_field: "productId" });

// Avoid model overwrite issue in Next.js
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
