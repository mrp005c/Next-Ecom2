import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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

  const { password, ...rest } = body;

  let updatedBody = body;

  if (password && password.length > 0) {
    // hash the password (saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    updatedBody = {
      ...rest,
      password: hashedPassword,
    };
  }

  // insert doc
  const result = await User.insertOne(updatedBody);

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

  const { password, ...rest } = body;

  let updatedBody = body;

  if (password && password.length > 0) {
    // hash the password (saltRounds = 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    updatedBody = {
      ...rest,
      password: hashedPassword,
    };
  }

  const result = await User.updateOne({ email: updatedBody.email }, updatedBody);

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
