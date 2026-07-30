"use client";

import { useState } from "react";
import { Mail, CheckCircle, Clock } from "lucide-react";
import { DeleteEnquiryButton } from "@/components/DeleteEnquiryButton";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

export default function EnquiriesClient({
  initialEnquiries,
  markRespondedAction,
  deleteEnquiryAction,
}: {
  initialEnquiries: Enquiry[];
  markRespondedAction: (formData: FormData) => Promise<void>;
  deleteEnquiryAction: (id: string) => Promise<void>;
}) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleMarkResponded(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setUpdatingId(id);
    try {
      const formData = new FormData(e.currentTarget);
      await markRespondedAction(formData);
      setEnquiries((prev) =>
        prev.map((enq) => (enq.id === id ? { ...enq, status: "responded" } : enq))
      );
    } catch (err) {
      console.error("Failed to mark as responded", err);
    } finally {
      setUpdatingId(null);
    }
  }

  const newCount = enquiries.filter((e) => e.status === "new").length;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Contact Enquiries</h1>
          <p className="text-ink-light">Messages sent from your public contact form.</p>
        </div>
        <span className="bg-magenta text-white text-sm font-bold px-4 py-1.5 rounded-pill self-start sm:self-auto">
          {newCount} new
        </span>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-cream border border-peach rounded-3xl p-16 text-center">
          <Mail className="mx-auto text-peach mb-4" size={48} />
          <p className="font-bold text-ink-light">No enquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all ${
                enquiry.status === "new" ? "border-magenta/40 shadow-bloom" : "border-peach"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-magenta rounded-full flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                    {enquiry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-extrabold text-ink">{enquiry.name}</p>
                    <a href={`mailto:${enquiry.email}`} className="text-sm text-magenta font-bold hover:underline">
                      {enquiry.email}
                    </a>
                    {enquiry.phone && (
                      <p className="text-sm text-ink-light">{enquiry.phone}</p>
                    )}
                    <p className="text-xs text-ink-light mt-1 flex items-center gap-1">
                      <Clock size={11} />
                      {new Date(enquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto mt-2 md:mt-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-bold border ${
                    enquiry.status === "new"
                      ? "text-magenta bg-pink-light border-pink"
                      : "text-green-700 bg-green-100 border-green-200"
                  }`}>
                    {enquiry.status === "new" ? <Clock size={11} /> : <CheckCircle size={11} />}
                    {enquiry.status === "new" ? "NEW" : "RESPONDED"}
                  </span>
                  {/* Delete Button */}
                  <DeleteEnquiryButton
                    id={enquiry.id}
                    name={enquiry.name}
                    action={async (id) => {
                      await deleteEnquiryAction(id);
                      setEnquiries((prev) => prev.filter((e) => e.id !== id));
                    }}
                  />
                </div>
              </div>

              <div className="bg-cream rounded-2xl px-5 py-4 mb-4">
                <p className="text-sm text-ink leading-relaxed">{enquiry.message}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`mailto:${enquiry.email}?subject=Re: Your enquiry to Sparkling Bakery`}
                  className="px-5 py-2.5 min-h-[44px] bg-magenta text-white text-sm font-bold rounded-xl hover:bg-rose-deep transition-colors text-center w-full sm:w-auto"
                >
                  Reply via Email
                </a>
                {enquiry.status === "new" && (
                  <form onSubmit={(e) => handleMarkResponded(e, enquiry.id)} className="w-full sm:w-auto">
                    <input type="hidden" name="id" value={enquiry.id} />
                    <button
                      type="submit"
                      disabled={updatingId === enquiry.id}
                      className="px-5 py-2.5 min-h-[44px] bg-cream border border-peach text-ink text-sm font-bold rounded-xl hover:bg-peach/50 transition-colors w-full sm:w-auto disabled:opacity-50"
                    >
                      {updatingId === enquiry.id ? "Updating..." : "Mark as Responded"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
