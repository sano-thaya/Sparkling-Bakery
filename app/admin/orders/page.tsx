import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Package, Clock, CheckCircle, XCircle, ChevronDown } from "lucide-react";

export const revalidate = 0;

const STATUS_OPTIONS = ["pending", "confirmed", "in-progress", "completed", "cancelled"];

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, payment: true },
  });

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath("/admin/orders");
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-700 bg-green-100 border-green-200";
      case "confirmed": return "text-blue-700 bg-blue-100 border-blue-200";
      case "in-progress": return "text-orange-700 bg-orange-100 border-orange-200";
      case "cancelled": return "text-red-700 bg-red-100 border-red-200";
      default: return "text-ink bg-peach/40 border-peach";
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Orders</h1>
          <p className="text-ink-light">Manage and update all customer cake orders.</p>
        </div>
        <span className="bg-magenta text-white text-sm font-bold px-4 py-1.5 rounded-pill">
          {orders.length} total
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-cream border border-peach rounded-3xl p-16 text-center">
          <Package className="mx-auto text-peach mb-4" size={48} />
          <p className="font-bold text-ink-light">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-peach p-6 shadow-sm">
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
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold border ${getStatusColor(order.status)}`}>
                    {order.status === "completed" && <CheckCircle size={12} />}
                    {order.status === "cancelled" && <XCircle size={12} />}
                    {order.status === "pending" && <Clock size={12} />}
                    {order.status.toUpperCase()}
                  </span>
                  <span className="font-serif text-xl font-bold text-magenta">
                    ${Number(order.price).toFixed(2)}
                  </span>
                </div>
              </div>

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
              <form action={updateStatus} className="flex items-center gap-3">
                <input type="hidden" name="id" value={order.id} />
                <div className="relative">
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="appearance-none bg-cream border border-peach text-ink text-sm font-bold rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-magenta cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none" />
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
    </div>
  );
}
