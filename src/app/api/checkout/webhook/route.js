import Stripe from "stripe";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function buffer(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const buf = await buffer(req);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // --- EVENT HANDLER ---
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    await connectDB();

    // Get metadata
    const userId = session.metadata.userId;
    const orderId = session.metadata.orderId;

    // Update order in MongoDB
    await Order.findByIdAndUpdate(orderId, {
      paid: true,
      stripePaymentId: session.payment_intent,
      paidAt: new Date(),
    });
  }

  return NextResponse.json({ received: true });
}
