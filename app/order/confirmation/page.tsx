import Link from "next/link";

export default function ConfirmationPage() {
  return (
    <div className="container section text-center" style={{ maxWidth: "600px" }}>
      <div className="card">
        <div style={{ color: "var(--color-rose)", fontSize: "4rem", marginBottom: "1rem" }}>
          ✓
        </div>
        <h1 className="title-lg mb-4">Order Confirmed!</h1>
        <p className="mb-6">
          Thank you for choosing Sparkling Bakery. Your payment has been received and your order is confirmed.
        </p>
        <p className="mb-8" style={{ opacity: 0.8 }}>
          We will contact you shortly if we need any additional details about your design.
        </p>
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
