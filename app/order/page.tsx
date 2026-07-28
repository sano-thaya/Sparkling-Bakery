import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export default function OrderPage() {
  async function createOrder(formData: FormData) {
    "use server";
    
    const guestName = formData.get("guestName") as string;
    const guestEmail = formData.get("guestEmail") as string;
    const guestPhone = formData.get("guestPhone") as string;
    const description = formData.get("description") as string;
    const deliveryDateStr = formData.get("deliveryDate") as string;
    
    // Hardcoded price for this example, in reality we might compute based on description or form options
    const price = 150.00; 

    // Create Order in DB
    const order = await prisma.order.create({
      data: {
        guestName,
        guestEmail,
        guestPhone,
        description,
        price,
        deliveryDate: new Date(deliveryDateStr),
        status: "pending",
      },
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Custom Cake Order",
              description: description,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/order`,
      client_reference_id: order.id,
      customer_email: guestEmail,
    });

    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error("Could not create Stripe session");
    }
  }

  return (
    <div className="container section" style={{ maxWidth: "800px" }}>
      <div className="card">
        <h1 className="title-lg text-center mb-6">Order Your Custom Cake</h1>
        
        <form action={createOrder}>
          <h2 className="mb-4">Contact Information</h2>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label htmlFor="guestName" className="form-label">Full Name</label>
              <input type="text" id="guestName" name="guestName" className="form-input" required />
            </div>
            <div className="form-group">
              <label htmlFor="guestEmail" className="form-label">Email</label>
              <input type="email" id="guestEmail" name="guestEmail" className="form-input" required />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="guestPhone" className="form-label">Phone Number</label>
            <input type="tel" id="guestPhone" name="guestPhone" className="form-input" />
          </div>

          <h2 className="mb-4 mt-8">Order Details</h2>
          <div className="form-group">
            <label htmlFor="description" className="form-label">Cake Details (Flavors, Theme, Size)</label>
            <textarea id="description" name="description" className="form-textarea" rows={4} required></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryDate" className="form-label">Requested Delivery/Pickup Date</label>
            <input type="date" id="deliveryDate" name="deliveryDate" className="form-input" required />
          </div>
          
          <div className="mt-8" style={{ backgroundColor: "var(--color-peach)", padding: "1.5rem", borderRadius: "8px" }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Base Price:</span>
              <span className="title-lg" style={{ color: "var(--color-rose)" }}>$150.00</span>
            </div>
            <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
              This is a standard base deposit for custom cakes. Final price may vary based on complex designs.
            </p>
          </div>
          
          <div className="text-center mt-8">
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
