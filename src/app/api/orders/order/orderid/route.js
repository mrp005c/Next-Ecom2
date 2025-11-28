import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

//Get Your Data
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("oid");
  await connectDB();
  const doc = await Order.findById(id);

  if (!doc || doc.length === 0) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Orders Not Found!",
    });
  }
  
  return NextResponse.json({
    success: true,
    error: false,
    message: "All Orders",
    result: doc,
  });
}
