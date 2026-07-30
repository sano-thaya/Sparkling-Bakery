import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import OrdersClient from "@/components/OrdersClient";

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true, payment: true },
  });

  // Serialise Decimal / Date before passing to client component
  const serialised = orders.map((o) => ({
    id: o.id,
    guestName: o.guestName,
    guestEmail: o.guestEmail,
    guestPhone: o.guestPhone,
    description: o.description,
    price: Number(o.price),
    status: o.status,
    deliveryDate: o.deliveryDate.toISOString(),
    createdAt: o.createdAt.toISOString(),
    customer: o.customer ? { name: o.customer.name, email: o.customer.email } : null,
    payment: o.payment ? { status: o.payment.status } : null,
  }));

  // ── Server actions ───────────────────────────────────────────
  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as string;
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath("/admin/orders");
  }

  async function deleteOrder(id: string) {
    "use server";
    // Payment cascades via schema onDelete: Cascade
    await prisma.order.delete({ where: { id } });
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }

  async function resetOrders() {
    "use server";
    await prisma.order.deleteMany();
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
  }

  return (
    <OrdersClient
      initialOrders={serialised}
      updateStatusAction={updateStatus}
      deleteOrderAction={deleteOrder}
      resetOrdersAction={resetOrders}
    />
  );
}
