import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { AnimatedSection } from "@/components/AnimatedSection";
import { getServerSession } from "next-auth";

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
          <div className="card p-8 md:p-12 shadow-elevated">
            <form action={createOrder} className="space-y-8">
              
              <div className="bg-peach/30 p-4 rounded-xl border border-peach mb-8 flex items-center gap-4">
                <div className="w-10 h-10 bg-magenta text-white rounded-full flex items-center justify-center font-bold">
                  {user.name?.charAt(0) || "C"}
                </div>
                <div>
                  <p className="text-sm text-ink font-bold">Ordering as {user.name || "Customer"}</p>
                  <p className="text-xs text-ink-light">{user.email}</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6 text-ink border-b border-peach pb-2">Cake Details</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="description" className="label-text">Design & Flavor Notes *</label>
                    <p className="text-xs text-ink-light mb-2">Please describe your desired theme, flavors, sizing, and any allergies.</p>
                    <textarea id="description" name="description" className="input-field min-h-[120px] resize-y" required placeholder="e.g. A 2-tier vanilla cake with strawberry filling and pink floral buttercream..."></textarea>
                  </div>
                  
                  <div>
                    <label htmlFor="deliveryDate" className="label-text">Requested Date *</label>
                    <input type="date" id="deliveryDate" name="deliveryDate" className="input-field md:w-1/2" required />
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-pink-light/30 to-peach/30 rounded-2xl p-6 border border-pink/50 mt-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-ink">Base Deposit:</span>
                  <span className="text-2xl font-serif text-magenta font-bold">${basePrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-ink-light font-medium">
                  This secures your date on our calendar. We will contact you to confirm final design details, which may incur additional costs depending on complexity.
                </p>
              </div>
              
              <div className="pt-4">
                <button type="submit" className="w-full btn-primary py-4 text-lg">
                  Proceed to Secure Payment
                </button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
