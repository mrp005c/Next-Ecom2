import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Cart from "@/models/Cart";

//Post Your Data
export async function POST(request) {

  await connectDB();
  const body = await request.json();
  const userId = body.userId;

  const doc = await Cart.exists({ userId: userId });
  if (doc) {
    const result = await Cart.updateOne(
      { userId: userId },
      { $addToSet: { products: body.products } }
    );
    return NextResponse.json({
      success: true,
      error: false,
      message: "Added to Cart!",
      result: result,
    });
  }

  // insert doc
  const result = await Cart.insertOne(body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Added to Cart!",
    // result: result,
  });
}

//Update Your Data
export async function PUT(request) {
  
  await connectDB();
  const body = await request.json();
   const userId = body.userId;

  // insert doc
  const result = await Cart.updateOne(
      { userId: userId },
      { $pull: { products: body.products } }
    );

  return NextResponse.json({
    success: true,
    error: false,
    message: "Removed From Cart!",
    result: result,
  });
}
//Delete Your Data
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();

  // Delete doc
  const result = await Cart.findOneAndDelete({userId: id});

  return NextResponse.json({
    success: true,
    error: false,
    message: "Cart Deleted Successful",
    // result: result,
  });
}

//Get Your Data
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId")
  await connectDB();
  const doc = await Cart.findOne({userId: userId});

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