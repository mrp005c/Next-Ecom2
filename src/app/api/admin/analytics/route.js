import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

//Get Your Data
export async function GET(request) {
  //   const { searchParams } = new URL(request.url);
  await connectDB();
  const readMessageCount = await Message.countDocuments({ readStatus: true });
  const unreadMessageCount = await Message.countDocuments({
    readStatus: false,
  });
  const productCount = await Product.countDocuments();
  const adminUserCount = await User.countDocuments({ role: "admin" });
  const userUserCount = await User.countDocuments({ role: "user" });
  const orderCount = await Order.countDocuments();

  return NextResponse.json({
    success: true,
    error: false,
    message: "documents are found!",
    result: {
      message: { read: readMessageCount, unread: unreadMessageCount },
      product: productCount,
      user: { admin: adminUserCount, user: userUserCount },
      order: orderCount,
    },
  });
}

/* 
//Post Your Data
export async function POST(request) {
//   const { searchParams } = new URL(request.url);
  await connectDB();
  const body = await request.json();

  // insert doc
  const result = await Message.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Message Sent Successful. Thank You for Contact Us!",
    // result: result,
  });
}
//Post Your Data
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")
  await connectDB();
  const body = await request.json();

  // insert doc
  const result = await Message.findByIdAndUpdate(id,body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Message Updated Successful!",
    // result: result,
  });
}
//Post Your Data
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")
  await connectDB();

  // Delete doc
  const result = await Message.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Message Deleted Successful",
    // result: result,
  });
}

*/
