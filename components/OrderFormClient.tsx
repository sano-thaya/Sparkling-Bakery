"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function OrderFormClient({
  basePrice,
  userName,
  userEmail,
  createOrderAction,
}: {
  basePrice: number;
  userName: string | null;
  userEmail: string | null;
  createOrderAction: (formData: FormData) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      await createOrderAction(formData);
      // It should redirect via server action, so we wait.
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred. Please try again.");
      setIsSubmitting(false); // Only re-enable on error
    }
  }

  return (
    <div className="card p-8 md:p-12 shadow-elevated w-full">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="bg-peach/30 p-4 rounded-xl border border-peach mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-magenta text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
            {userName?.charAt(0) || "C"}
          </div>
          <div className="overflow-hidden w-full">
            <p className="text-sm text-ink font-bold truncate">Ordering as {userName || "Customer"}</p>
            <p className="text-xs text-ink-light truncate">{userEmail}</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
            <AlertTriangle size={16} />
            {errorMsg}
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 text-ink border-b border-peach pb-2">Cake Details</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="description" className="label-text">Design & Flavor Notes *</label>
              <p className="text-xs text-ink-light mb-2">Please describe your desired theme, flavors, sizing, and any allergies.</p>
              <textarea 
                id="description" 
                name="description" 
                className="input-field min-h-[120px] resize-y py-3 w-full" 
                required 
                placeholder="e.g. A 2-tier vanilla cake with strawberry filling and pink floral buttercream..."
              />
            </div>
            
            <div>
              <label htmlFor="deliveryDate" className="label-text">Requested Date *</label>
              <input 
                type="date" 
                id="deliveryDate" 
                name="deliveryDate" 
                className="input-field w-full md:w-1/2 py-3" 
                required 
              />
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
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary py-4 text-lg min-h-[44px] disabled:opacity-50"
          >
            {isSubmitting ? "Processing..." : "Proceed to Secure Payment"}
          </button>
        </div>
      </form>
    </div>
  );
}
