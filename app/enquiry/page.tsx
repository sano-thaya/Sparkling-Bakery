"use client";

import { useState } from "react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { CheckCircle, Send, Mail, Phone, MapPin, Clock } from "lucide-react";

export default function EnquiryPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    const body = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    }
  }

  return (
    <div className="bg-cream min-h-screen py-24 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-white/60 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-light/40 rounded-full blur-3xl z-0" />

      <div className="container-custom relative z-10 pt-10">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block py-1.5 px-4 rounded-pill bg-white/80 text-magenta font-bold text-sm mb-4 shadow-sm border border-pink">
            💬 We'd Love to Hear From You
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-ink mb-4">Contact Us</h1>
          <p className="text-ink-light text-lg font-medium max-w-xl mx-auto">
            Have a question, or want to start planning your custom cake? Drop us a message and we'll get back to you within 24 hours.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

          {/* Info Panel */}
          <AnimatedSection delay={0.05} className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-ink rounded-3xl p-8 text-cream flex-1">
              <h2 className="text-2xl font-extrabold mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-magenta rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-cream/60 mb-1">Email Us</p>
                    <p className="font-bold">hello@sparklingbakery.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-magenta rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-cream/60 mb-1">Call Us</p>
                    <p className="font-bold">+41 78 261 25 17</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-magenta rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-cream/60 mb-1">Visit Us</p>
                    <p className="font-bold">zurich, switzerland</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-magenta rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-cream/60 mb-1">Hours</p>
                    <p className="font-bold">Mon–Sat: 6pm – 10pm</p>
                    <p className="font-bold text-cream/70">Sunday: 10am – 4pm</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form / Success Panel */}
          <AnimatedSection delay={0.1} className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-elevated p-8 md:p-10 border border-peach h-full">
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-16 gap-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={44} className="text-green-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-ink">Message Sent!</h2>
                  <p className="text-ink-light text-lg font-medium max-w-sm">
                    Thank you for reaching out. We'll get back to you within 24 hours!
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-4 px-8 py-3 rounded-pill bg-magenta text-white font-bold hover:bg-rose-deep transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-ink mb-8">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-bold text-ink-light mb-2">Your Name *</label>
                        <input type="text" id="name" name="name" className="input-field py-3" required placeholder="Jane Doe" />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-bold text-ink-light mb-2">Phone Number</label>
                        <input type="tel" id="phone" name="phone" className="input-field py-3" placeholder="+41 78 000 00 00" />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-ink-light mb-2">Email Address *</label>
                      <input type="email" id="email" name="email" className="input-field py-3" required placeholder="jane@example.com" />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-bold text-ink-light mb-2">Message *</label>
                      <textarea id="message" name="message" className="input-field min-h-[140px] resize-y py-3" required placeholder="Tell us about your dream cake, or just say hello!"></textarea>
                    </div>

                    {status === "error" && (
                      <p className="text-rose-deep text-sm font-bold bg-red-50 border border-rose-deep/20 rounded-xl px-4 py-3">
                        {errorMsg}
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full btn-primary py-4 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {status === "sending" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={18} />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
