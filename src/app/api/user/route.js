import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

//Post Your Data
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const doc = await User.findOne({ email: body.email });
  
  if (doc) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "User Already Exists!",
    });
  }

  // insert doc
  
  const result = await User.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Credential Added, Please Login",
    // result: result,
  });
}

//Update Your Data
export async function PUT(request) {
  await connectDB();
  const body = await request.json();
  const result = await User.updateOne({ email: body.email }, body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Profile Updated, Please Login again to see the change you made",
    // result: result,
  });
}


//Get Your Data
export async function GET(request) {
  await connectDB();
  const doc = await User.find();
  
  if (!doc) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Users Not Found!",
    });
  }

  return NextResponse.json({
    success: true,
    error: false,
    message: "All Users",
    result: doc,
  });
}
