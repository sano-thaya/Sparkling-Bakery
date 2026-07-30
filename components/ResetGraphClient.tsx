"use client";

import { useState } from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

export default function ResetGraphClient({
  resetGraphAction,
}: {
  resetGraphAction: () => Promise<void>;
}) {
  const [showReset, setShowReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function confirmReset() {
    setResetLoading(true);
    try {
      await resetGraphAction();
    } finally {
      setResetLoading(false);
      setShowReset(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setShowReset(true)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-red-400 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
      >
        <RotateCcw size={15} />
        Reset Graph Data
      </button>

      {/* ── Reset All Modal ── */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-elevated border border-peach max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-2xl">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-extrabold text-ink">Reset Graph Data</h2>
              </div>
              <button 
                onClick={() => setShowReset(false)} 
                className="text-ink-light hover:text-ink transition-colors p-2 -mr-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6">
              <p className="text-sm text-red-800 font-medium leading-relaxed">
                This will reset the graph and revenue analytics by hiding all previous orders from the chart. 
                <br /><br />
                <span className="font-extrabold">Existing orders will not be deleted</span>, but the chart will start fresh from today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => setShowReset(false)}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] border border-peach rounded-xl text-ink font-bold text-sm hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                disabled={resetLoading}
                className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex justify-center items-center gap-2"
              >
                {resetLoading ? "Resetting…" : "Reset Analytics"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
