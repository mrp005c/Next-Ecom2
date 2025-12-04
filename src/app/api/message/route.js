import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

//Post Your Data
export async function POST(request) {

  await connectDB();
  const body = await request.json();

  // insert doc
  const result = await Message.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Message Sent Successful. Thank You for Contacting Us!",
    // result: result,
  });
}

//Update Your Data
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
//Delete Your Data
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


//Get Your Data
export async function GET(request) {
//   const { searchParams } = new URL(request.url);
  await connectDB();
  const doc = await Message.find();
  
  if (!doc || doc.length === 0) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Messages Not Found!",
    });
  }

  return NextResponse.json({
    success: true,
    error: false,
    message: "All Messages",
    result: doc,
  });
}
