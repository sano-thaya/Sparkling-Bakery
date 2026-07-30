import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getServerSession } from "next-auth";
import OrderFormClient from "@/components/OrderFormClient";

export default async function OrderPage() {
  const session = await getServerSession();
  
  // Enforce authentication
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/order");
  }

  // Fetch the active user ID based on email
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch base price
  let basePrice = 150.00;
  try {
    const settings = await prisma.settings.findFirst();
    if (settings && settings.baseAmount) {
      basePrice = Number(settings.baseAmount);
    }
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  async function createOrder(formData: FormData) {
    "use server";
    
    // We already checked authentication on page load, but Server Actions need their own auth check
    const sessionAction = await getServerSession();
    if (!sessionAction?.user?.email) {
      throw new Error("Unauthorized");
    }

    const actionUser = await prisma.user.findUnique({
      where: { email: sessionAction.user.email }
    });
    
    if (!actionUser) throw new Error("Unauthorized");

    const description = formData.get("description") as string;
    const deliveryDateStr = formData.get("deliveryDate") as string;
    
    // Fetch base price again securely
    let price = 150.00;
    const settings = await prisma.settings.findFirst();
    if (settings && settings.baseAmount) price = Number(settings.baseAmount);

    const order = await prisma.order.create({
      data: {
        customerId: actionUser.id,
        // Keep these fields for backward compatibility if needed, but fill from logged in user
        guestName: actionUser.name || "Customer",
        guestEmail: actionUser.email,
        description,
        price,
        deliveryDate: new Date(deliveryDateStr),
        status: "pending",
      },
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Custom Cake Order Deposit",
              description: description.substring(0, 255),
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/order`,
      client_reference_id: order.id,
      customer_email: actionUser.email,
    });

    if (stripeSession.url) {
      redirect(stripeSession.url);
    } else {
      throw new Error("Could not create Stripe session");
    }
  }

  return (
    <div className="bg-cream min-h-screen py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-light/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/60 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="container-custom relative z-10 max-w-3xl pt-10">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">Start Your Order</h1>
          <p className="text-ink-light text-lg font-medium">
            Let's bring your vision to life. Please provide the details below, and we'll secure your booking with a base deposit.
          </p>
        </AnimatedSection>
        
        <AnimatedSection delay={0.1}>
          <OrderFormClient 
            basePrice={basePrice}
            userName={user.name}
            userEmail={user.email}
            createOrderAction={createOrder}
          />
        </AnimatedSection>
      </div>
    </div>
  );
}
