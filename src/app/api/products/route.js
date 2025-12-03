import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

//Post Your Data

//Get Your Data
export async function GET(request) {
  await connectDB();
  const result = await Product.find();

  // return Response.json(result);
  if (result.length > 0) {
    return NextResponse.json({
      success: true,
      error: false,
      result: result,
      message: "Products Found",
    });
  }
  return NextResponse.json({
    success: false,
    error: true,
    message: "Products Not Found !",
  });
}
