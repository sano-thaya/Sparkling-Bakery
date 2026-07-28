import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default function EnquiryPage() {
  async function submitEnquiry(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const message = formData.get("message") as string;

    await prisma.enquiry.create({
      data: { name, email, phone, message },
    });
    
    // Redirect or show success state. For simplicity, just revalidate path to clear form.
    // In a real app we'd probably redirect to a thank you page.
  }

  return (
    <div className="container section" style={{ maxWidth: "800px" }}>
      <div className="card">
        <h1 className="title-lg text-center mb-6">Get in Touch</h1>
        <p className="text-center mb-8">
          Have a question about a custom order or just want to say hello? Fill out the form below and we'll get back to you soon.
        </p>

        <form action={submitEnquiry}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" name="name" className="form-input" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" name="email" className="form-input" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
            <input type="tel" id="phone" name="phone" className="form-input" />
          </div>
          
          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea id="message" name="message" className="form-textarea" rows={5} required></textarea>
          </div>
          
          <div className="text-center mt-8">
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
