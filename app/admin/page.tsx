import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, cancelledOrders, next7DaysOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
    prisma.order.count({
      where: {
        deliveryDate: {
          gte: new Date(),
          lte: new Date(new Date().setDate(new Date().getDate() + 7))
        }
      }
    })
  ]);

  const payments = await prisma.payment.findMany({
    where: {
      order: {
        status: {
          not: "cancelled"
        }
      }
    }
  });

  const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div>
      <h1 className="title-lg mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <h3>Total Revenue</h3>
          <p className="title-lg" style={{ color: "var(--color-rose)" }}>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="card text-center">
          <h3>Total Orders</h3>
          <p className="title-lg">{totalOrders}</p>
        </div>
        <div className="card text-center">
          <h3>Pending Orders</h3>
          <p className="title-lg">{pendingOrders}</p>
        </div>
        <div className="card text-center">
          <h3>Cancelled Orders</h3>
          <p className="title-lg">{cancelledOrders}</p>
        </div>
        <div className="card text-center">
          <h3>Deliveries (Next 7 Days)</h3>
          <p className="title-lg">{next7DaysOrders}</p>
        </div>
      </div>
    </div>
  );
}
