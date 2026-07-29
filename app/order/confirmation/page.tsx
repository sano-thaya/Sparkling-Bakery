import Link from "next/link";
import { AnimatedSection } from "@/components/AnimatedSection";

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  return (
    <div className="bg-cream min-h-screen py-32 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center z-0 opacity-40">
        <div className="w-[600px] h-[600px] bg-pink-light rounded-full blur-3xl"></div>
      </div>
      
      <AnimatedSection className="container-custom max-w-xl relative z-10 text-center">
        <div className="glass-card p-12 shadow-elevated border border-gold/20 flex flex-col items-center">
          <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 font-serif text-brown">Order Received!</h1>
          <p className="text-brown-light text-lg mb-8 leading-relaxed">
            Thank you for your order! Your deposit has been securely processed. We will review your details and contact you shortly to finalize your bespoke cake design.
          </p>
          
          {sessionId && (
            <div className="bg-white px-4 py-2 rounded-lg border border-beige-dark text-sm text-brown-light mb-8 font-mono">
              Ref: {sessionId.substring(0, 12)}...
            </div>
          )}
          
          <Link href="/" className="inline-block px-8 py-3 rounded-full bg-brown text-white font-medium hover:bg-brown-light transition-colors duration-300">
            Return Home
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
