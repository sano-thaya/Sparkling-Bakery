import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status || undefined;

  const orders = await prisma.order.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
    include: { payment: true }
  });

  async function updateOrderStatus(formData: FormData) {
    "use server";
    const orderId = formData.get("orderId") as string;
    const newStatus = formData.get("status") as string;
    
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    });
    
    revalidatePath("/admin/orders");
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="title-lg">Manage Orders</h1>
        <div>
          <span className="mr-2">Filter by Status:</span>
          <a href="/admin/orders" className="btn btn-secondary mr-2" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>All</a>
          <a href="/admin/orders?status=pending" className="btn btn-secondary mr-2" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Pending</a>
          <a href="/admin/orders?status=confirmed" className="btn btn-secondary mr-2" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Confirmed</a>
          <a href="/admin/orders?status=completed" className="btn btn-secondary mr-2" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Completed</a>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--color-peach)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Customer</th>
              <th style={{ padding: '1rem' }}>Date/Delivery</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Total</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>...{order.id.slice(-6)}</td>
                <td style={{ padding: '1rem' }}>{order.guestName || 'Account User'}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                  Ordered: {order.createdAt.toLocaleDateString()}<br/>
                  Due: <strong>{order.deliveryDate.toLocaleDateString()}</strong>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    backgroundColor: order.status === 'confirmed' ? '#e6fffa' : (order.status === 'pending' ? '#fffaf0' : '#f0f4ff'),
                    color: order.status === 'confirmed' ? '#2c7a7b' : (order.status === 'pending' ? '#c05621' : '#4c51bf')
                  }}>
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>${Number(order.price).toFixed(2)}</td>
                <td style={{ padding: '1rem' }}>
                  <form action={updateOrderStatus} style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="hidden" name="orderId" value={order.id} />
                    <select name="status" className="form-select" style={{ padding: '0.25rem', width: 'auto', fontSize: '0.875rem' }}>
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>Update</button>
                  </form>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
