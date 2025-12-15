import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/emailutils";

//Post Your Data
export async function POST(request) {
  await connectDB();
  const body = await request.json();

  // insert doc

  const { name, email, subject, message } = body;
  try {
    const result = await Message.insertOne(body);

    // // 2️⃣ Send confirmation email
    await sendConfirmationEmail({
      to: email,
      name,
      subject,
    });

    return NextResponse.json({
      success: true,
      message: "Message received.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.status(500).json({
      success: false,
      message: "Failed to send confirmation email",
    });
  }
}

//Update Your Data
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();
  const body = await request.json();

  // insert doc
  const result = await Message.findByIdAndUpdate(id, body);

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
  const id = searchParams.get("id");
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
