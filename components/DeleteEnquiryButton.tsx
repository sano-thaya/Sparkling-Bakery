"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

export function DeleteEnquiryButton({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: (id: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await action(id);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Delete enquiry"
        className="p-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-colors"
      >
        <Trash2 size={15} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-elevated border border-peach max-w-md w-full p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-2xl flex-shrink-0">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-ink mb-1">Delete this enquiry?</h2>
                <p className="text-sm text-ink-light">
                  The enquiry from <span className="font-bold">{name}</span> will be permanently deleted.
                  This can&apos;t be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                className="px-5 py-2.5 border border-peach rounded-xl text-ink font-bold text-sm hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 disabled:opacity-60 transition-colors"
              >
                {loading ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
