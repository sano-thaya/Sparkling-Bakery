"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function SettingsFormClient({
  currentBasePrice,
  updateSettingsAction,
}: {
  currentBasePrice: number;
  updateSettingsAction: (formData: FormData) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const formData = new FormData(e.currentTarget);
      await updateSettingsAction(formData);
      setSuccessMsg("Settings updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft p-8 border border-peach max-w-xl w-full">
      <h2 className="text-xl font-bold mb-6 text-ink border-b border-peach pb-4">Pricing Configuration</h2>
      
      {successMsg && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 text-sm font-bold">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}
      
      {errorMsg && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
          <AlertTriangle size={16} />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="baseAmount" className="block text-sm font-bold text-ink-light mb-2">
            Base Cake Price ($)
          </label>
          <p className="text-xs text-ink-light/80 mb-3">
            This is the default starting price shown on the order page deposit.
          </p>
          <input
            type="number"
            id="baseAmount"
            name="baseAmount"
            step="0.01"
            min="0"
            defaultValue={currentBasePrice}
            className="w-full px-5 py-3.5 rounded-xl border border-peach bg-white text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-magenta"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-magenta text-white font-bold rounded-pill shadow-sm hover:bg-magenta-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
