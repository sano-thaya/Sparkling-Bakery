import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.client_reference_id;
    const paymentIntent = session.payment_intent as string;
    const amount = session.amount_total / 100; // Convert cents to dollars

    if (orderId) {
      // Update order status to confirmed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "confirmed" },
      });

      // Create Payment record
      await prisma.payment.create({
        data: {
          orderId: orderId,
          amount: amount,
          stripePaymentId: paymentIntent,
          status: "completed",
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
