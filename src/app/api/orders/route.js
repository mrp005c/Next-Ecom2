import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

//Get Your Data
export async function GET(request) {
  //   const { searchParams } = new URL(request.url);
  await connectDB();
  const doc = await Order.find();

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

//Post Your Data
export async function POST(request) {
  //   const { searchParams } = new URL(request.url);
  await connectDB();
  const body = await request.json();

  // insert doc
  try {
    const result = await Order.insertOne(body);

    return NextResponse.json({
      success: true,
      error: false,
      message: "Ordered Successful. Thank You!",
      result: result,
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json({
      success: false,
      error: true,
      message: "Ordered Unsuccessful. Thank You!",
      result: error,
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
  const result = await Order.findByIdAndUpdate(id, body);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Order Updated Successful!",
    // result: result,
  });
}
//Delete Your Data
export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await connectDB();

  // Delete doc
  const result = await Order.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    error: false,
    message: "Order Deleted Successful",
    // result: result,
  });
}

/* 

export async function (request) {
  await connectDB();
  const result = await Product.find();
  
  // return Response.json(result);
  if (result.length > 0) {
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
    message: "Invoice Not Found !",
  });
}


export async function DELETE(request) {


  const result = await collection.deleteOne({invoiceId});
  
  if (!result) {
    return NextResponse.json({
      success: false,
      error: true,
      message: "Your Invoice Couldn't Be Deleted",
    });
  }
  return NextResponse.json({
    success: true,
    error: false,
    message: "Your Invoice Deleted",
    result: result,
  });
}

export async function PUT(request) {
     let pathName = request.method
   
    return NextNextResponse.json({success: true, data:pathName , name:"Your Put Request"})
}
export async function HEAD(request) {}
 
 
 
 
export async function PATCH(request) {}
 
*/
