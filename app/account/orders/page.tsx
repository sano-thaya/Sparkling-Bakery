import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Package, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function MyOrdersPage() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { payment: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-ink-light bg-peach/30 border-peach'; // pending
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <Package size={16} />;
    }
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="container-custom max-w-4xl">
        <AnimatedSection className="mb-10">
          <h1 className="text-4xl font-extrabold text-ink mb-2">My Orders</h1>
          <p className="text-ink-light font-medium">Track your recent purchases and cake orders.</p>
        </AnimatedSection>

        {user.orders.length === 0 ? (
          <AnimatedSection delay={0.1}>
            <div className="card p-12 text-center flex flex-col items-center justify-center">
              <Package size={48} className="text-peach mb-4" />
              <h2 className="text-xl font-bold text-ink mb-2">No orders yet</h2>
              <p className="text-ink-light mb-6">When you place an order, it will appear here.</p>
              <a href="/order" className="btn-primary inline-block">Start an Order</a>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-6">
            {user.orders.map((order, i) => (
              <AnimatedCard key={order.id} index={i}>
                <div className="card p-6 border border-peach/50 hover:shadow-elevated transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-peach">
                    <div>
                      <p className="text-xs font-bold text-ink-light uppercase tracking-wider mb-1">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-sm font-bold text-ink">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-bold border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.toUpperCase()}
                      </span>
                      <span className="font-serif font-bold text-xl text-magenta">
                        ${Number(order.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-ink-light uppercase mb-2">Delivery/Pickup Date</h4>
                      <p className="text-sm font-bold text-ink flex items-center gap-2">
                        <Clock size={14} className="text-magenta" />
                        {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink-light uppercase mb-2">Details</h4>
                      <p className="text-sm text-ink line-clamp-2 font-medium">{order.description}</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
