import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let event;
  const rawBody = await req.text(); // must get raw body

  const signature = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature error", err);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle event types
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const orderId = session.metadata.orderId;

    await connectDB();

    // Update order in MongoDB
    await Order.findByIdAndUpdate(orderId, {
      paid: true,
      status: "confirm",
      paymentId: session.payment_intent,
      paidAt: new Date(),
    });

    console.log("✅ Order updated:", session.metadata.orderId);
  }

  return new NextResponse("OK", { status: 200 });
}
