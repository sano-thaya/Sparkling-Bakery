"use client";

import { useState, useMemo, useTransition } from "react";
import {
  Trash2, ChevronUp, ChevronDown, ChevronsUpDown,
  Package, Clock, CheckCircle, XCircle, ChevronDown as ChevronDownIcon,
  AlertTriangle, X, RotateCcw
} from "lucide-react";

type Order = {
  id: string;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  description: string;
  price: string | number;
  status: string;
  deliveryDate: string | Date;
  createdAt: string | Date;
  customer: { name: string | null; email: string } | null;
  payment: { status: string } | null;
};

type SortField = "deliveryDate" | "amount" | "status";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

const STATUS_COLOR: Record<string, string> = {
  completed: "text-green-700 bg-green-100 border-green-200",
  confirmed: "text-blue-700 bg-blue-100 border-blue-200",
  "in-progress": "text-orange-700 bg-orange-100 border-orange-200",
  cancelled: "text-red-700 bg-red-100 border-red-200",
  pending: "text-ink bg-peach/40 border-peach",
};

function SortIcon({ field, sort }: { field: SortField; sort: { field: SortField; dir: SortDir } }) {
  if (sort.field !== field) return <ChevronsUpDown size={13} className="text-ink-light/50" />;
  return sort.dir === "asc"
    ? <ChevronUp size={13} className="text-magenta" />
    : <ChevronDown size={13} className="text-magenta" />;
}

export default function OrdersClient({
  initialOrders,
  updateStatusAction,
  deleteOrderAction,
  resetOrdersAction,
}: {
  initialOrders: Order[];
  updateStatusAction: (formData: FormData) => Promise<void>;
  deleteOrderAction: (id: string) => Promise<void>;
  resetOrdersAction: () => Promise<void>;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({ field: "deliveryDate", dir: "asc" });
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Single delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Reset modal
  const [showReset, setShowReset] = useState(false);
  const [resetPhrase, setResetPhrase] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const [, startTransition] = useTransition();

  // ── Sorting ──────────────────────────────────────────────────
  function toggleSort(field: SortField) {
    setSort(prev =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" }
    );
  }

  // ── Derived list ─────────────────────────────────────────────
  const visible = useMemo(() => {
    let list = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);
    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sort.field === "deliveryDate") {
        cmp = new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime();
      } else if (sort.field === "amount") {
        cmp = Number(a.price) - Number(b.price);
      } else if (sort.field === "status") {
        cmp = a.status.localeCompare(b.status);
      }
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [orders, sort, statusFilter]);

  // ── Delete single ─────────────────────────────────────────────
  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteOrderAction(deleteTarget.id);
      setOrders(prev => prev.filter(o => o.id !== deleteTarget.id));
    } finally {
      setDeleteLoading(false);
      setDeleteTarget(null);
    }
  }

  // ── Reset all ─────────────────────────────────────────────────
  async function confirmReset() {
    if (resetPhrase !== "DELETE") return;
    setResetLoading(true);
    try {
      await resetOrdersAction();
      setOrders([]);
    } finally {
      setResetLoading(false);
      setShowReset(false);
      setResetPhrase("");
    }
  }

  // ── Status update (optimistic) ────────────────────────────────
  function handleStatusForm(e: React.FormEvent<HTMLFormElement>, orderId: string) {
    // Just let server action run; refresh from server on next load
    // (no optimistic needed for status)
    startTransition(() => {});
  }

  // ─────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Orders</h1>
          <p className="text-ink-light">Manage and update all customer cake orders.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-magenta text-white text-sm font-bold px-4 py-1.5 rounded-pill">
            {orders.length} total
          </span>
          {orders.length > 0 && (
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-red-400 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors"
            >
              <RotateCcw size={15} />
              Reset Orders
            </button>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="mb-5 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-ink-light uppercase tracking-wide mr-1">Filter:</span>
        {["all", ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-pill text-xs font-bold border transition-colors ${
              statusFilter === s
                ? "bg-magenta text-white border-magenta"
                : "bg-white text-ink-light border-peach hover:border-magenta/50"
            }`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Sort controls */}
      {orders.length > 0 && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-ink-light uppercase tracking-wide mr-1">Sort by:</span>
          {(["deliveryDate", "amount", "status"] as SortField[]).map(field => (
            <button
              key={field}
              onClick={() => toggleSort(field)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-bold border border-peach bg-white hover:border-magenta/50 transition-colors"
            >
              {field === "deliveryDate" ? "Delivery Date" : field === "amount" ? "Amount" : "Status"}
              <SortIcon field={field} sort={sort} />
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="bg-cream border border-peach rounded-3xl p-16 text-center">
          <Package className="mx-auto text-peach mb-4" size={48} />
          <p className="font-bold text-ink-light">No orders yet.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-cream border border-peach rounded-3xl p-12 text-center">
          <p className="font-bold text-ink-light">No orders match the current filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-peach p-6 shadow-sm">
              {/* Top row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-peach">
                <div>
                  <p className="text-xs font-bold text-ink-light uppercase tracking-wider">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-bold text-ink text-lg">
                    {order.customer?.name || order.guestName || "Guest"}
                  </p>
                  <p className="text-sm text-ink-light">
                    {order.customer?.email || order.guestEmail}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold border ${STATUS_COLOR[order.status] ?? STATUS_COLOR.pending}`}>
                    {order.status === "completed" && <CheckCircle size={12} />}
                    {order.status === "cancelled" && <XCircle size={12} />}
                    {order.status === "pending" && <Clock size={12} />}
                    {order.status.toUpperCase()}
                  </span>
                  <span className="font-serif text-xl font-bold text-magenta">
                    ${Number(order.price).toFixed(2)}
                  </span>
                  {/* Delete button */}
                  <button
                    onClick={() => setDeleteTarget(order)}
                    title="Delete order"
                    className="p-2 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Detail grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs font-bold text-ink-light uppercase mb-1">Delivery Date</p>
                  <p className="text-sm font-bold text-ink flex items-center gap-1">
                    <Clock size={13} className="text-magenta" />
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-light uppercase mb-1">Placed On</p>
                  <p className="text-sm font-bold text-ink">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-light uppercase mb-1">Payment</p>
                  <p className={`text-sm font-bold ${order.payment?.status === "paid" ? "text-green-600" : "text-orange-600"}`}>
                    {order.payment?.status?.toUpperCase() || "PENDING"}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-ink-light uppercase mb-1">Order Details</p>
                <p className="text-sm text-ink bg-cream rounded-xl px-4 py-3">{order.description}</p>
              </div>

              {/* Status updater */}
              <form action={updateStatusAction} onSubmit={e => handleStatusForm(e, order.id)} className="flex items-center gap-3">
                <input type="hidden" name="id" value={order.id} />
                <div className="relative">
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="appearance-none bg-cream border border-peach text-ink text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-magenta cursor-pointer"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDownIcon size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-magenta text-white text-sm font-bold rounded-xl hover:bg-rose-deep transition-colors"
                >
                  Update Status
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-elevated border border-peach max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-2xl flex-shrink-0">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-ink mb-1">Delete this order?</h2>
                <p className="text-sm text-ink-light">
                  Order <span className="font-bold">#{deleteTarget.id.slice(-8).toUpperCase()}</span> from{" "}
                  <span className="font-bold">{deleteTarget.customer?.name || deleteTarget.guestName || "Guest"}</span>{" "}
                  will be permanently deleted along with its payment record. This can&apos;t be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 border border-peach rounded-xl text-ink font-bold text-sm hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {deleteLoading ? "Deleting…" : "Yes, Delete Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reset All Modal ── */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-elevated border border-peach max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-2xl">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h2 className="text-xl font-extrabold text-ink">Reset All Orders</h2>
              </div>
              <button onClick={() => { setShowReset(false); setResetPhrase(""); }} className="text-ink-light hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 mb-6">
              <p className="text-sm text-red-800 font-medium leading-relaxed">
                This will permanently delete all <span className="font-extrabold">{orders.length}</span> order{orders.length !== 1 ? "s" : ""} and their payment records.{" "}
                <span className="font-extrabold">This cannot be undone.</span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-ink mb-2">
                Type <span className="font-extrabold text-red-600 font-mono">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={resetPhrase}
                onChange={e => setResetPhrase(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-3 border-2 border-peach rounded-xl font-mono font-bold text-ink focus:outline-none focus:border-red-400 transition-colors"
                autoComplete="off"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowReset(false); setResetPhrase(""); }}
                className="px-5 py-2.5 border border-peach rounded-xl text-ink font-bold text-sm hover:bg-cream transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                disabled={resetPhrase !== "DELETE" || resetLoading}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {resetLoading ? "Resetting…" : "Delete All Orders"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
