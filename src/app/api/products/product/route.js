import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// Update your data
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  // const id = searchParams.get("id");
  const body = await request.json();
  const id = body.id;
  delete body.id;
  await connectDB();

  const result = await Product.findByIdAndUpdate(
    id,
    { $set: body },
    {
      new: true,
      runValidators: true,
    }
  );

  if (result) {
    return NextResponse.json({
      success: true,
      error: false,
      result: result,
      message: "Products Updated",
    });
  }
  return NextResponse.json({
    success: false,
    error: true,
    message: "Product Not Found !",
  });
}

// Delete

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();
  const result = await Product.findByIdAndDelete(id);

  if (result) {
    return NextResponse.json({
      success: true,
      error: false,
      result: result,
      message: "Products Deleted",
    });
  }
  return NextResponse.json({
    success: false,
    error: true,
    message: "Product Not Found and Not Deleted !",
  });
}

//Get Your Data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("productId");
  await connectDB();
  const result = await Product.findOne({productId: id});

  // return Response.json(result);
  if (result) {
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
    message: "Product Not Found !",
  });
}
// Add product
export async function POST(request) {
  // const { searchParams } = new URL(request.url);
  await connectDB();
  const body = await request.json();
  const doc = await Product.find({ productId: body.productId });
  
  if (doc.length > 0) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Already Exists!",
    });
  }
  // insert doc
  
  const result = await Product.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Your Product Added",
    result: result,
  });
}
