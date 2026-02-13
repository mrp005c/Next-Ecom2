import { connectDB } from "@/lib/mongodb";
import Rakibmessage from "@/models/Rakib-dev";
import { NextResponse } from "next/server";
import { corsHeaders } from "@/lib/corsHeaders";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

//Post Your Data
export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const doc = await Rakibmessage.insertOne(body);

  return NextResponse.json(
    {
      success: true,
      error: false,
      message: "Message Added",
      result: doc,
    },
    { headers: corsHeaders },
  );
}

//Get Your Data
export async function GET(request) {
  await connectDB();
  const doc = await Rakibmessage.find();

  if (!doc) {
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Messages Not Found!",
      },
      { headers: corsHeaders },
    );
  }

  return NextResponse.json(
    {
      success: true,
      error: false,
      message: "All Messages",
      result: doc,
    },
    { headers: corsHeaders },
  );
}

//Update Your Data
export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const read = searchParams.get("read");
  await connectDB();
  const body = await request.json();
  console.log(body, id);
  // insert doc
  const result = await Rakibmessage.findByIdAndUpdate(
    id,
    { $set: { readStatus: body.readStatus } },
    {
      new: true,
      runValidators: true,
    },
  );

  return NextResponse.json(
    {
      success: true,
      error: false,
      message: "Message Updated Successful!",
      result: result,
    },
    { headers: corsHeaders },
  );
}
//Delete Your Data
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();

  // Delete doc
  const result = await Rakibmessage.findByIdAndDelete(id);

  return NextResponse.json(
    {
      success: true,
      error: false,
      message: "Message Deleted Successful",
      result: result,
    },
    { headers: corsHeaders },
  );
}
