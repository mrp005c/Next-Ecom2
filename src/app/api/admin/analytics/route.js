import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

//Get Your Data
export async function GET() {
  
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
