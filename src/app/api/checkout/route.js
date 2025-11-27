import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const data = await req.json();
  console.log(data)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/cancel`,
    line_items: data.products.map((p) => ({
      price_data: {
        currency: "usd",
        product_data: { name: p.name },
        unit_amount: p.price * 100,
      },
      quantity: p.quantity,
    })),
    metadata: {
      orderId: data.orderId,
      userId: data.userId
    },
  });

  return Response.json({ url: session.url });
}
