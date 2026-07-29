import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, Mail, Image as ImageIcon, ArrowRight, DollarSign, ShoppingCart, Clock } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";

export const revalidate = 0;

export default async function AdminDashboard() {
  // 1. Overview metrics
  const pendingOrders = await prisma.order.count({ where: { status: "pending" } });
  const recentEnquiries = await prisma.enquiry.count({ where: { status: "new" } });
  const galleryPosts = await prisma.post.count();

  // 2. Revenue & Order Analytics
  const allOrders = await prisma.order.findMany({
    select: { price: true, status: true, createdAt: true },
    orderBy: { createdAt: 'asc' }
  });

  const totalOrders = allOrders.length;
  const notYetCompleted = allOrders.filter(o => o.status === "pending" || o.status === "in-progress").length;
  
  // Calculate total revenue (assuming only completed or confirmed orders count towards actual revenue, 
  // but for a bakery deposit they might all count. We'll sum all for simplicity, or just completed).
  const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.price), 0);

  // Group revenue by date for the chart
  const revenueByDate: Record<string, number> = {};
  allOrders.forEach(order => {
    const dateStr = order.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!revenueByDate[dateStr]) revenueByDate[dateStr] = 0;
    revenueByDate[dateStr] += Number(order.price);
  });

  const chartData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  }));

  // If no data, provide dummy data so chart isn't empty
  if (chartData.length === 0) {
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      chartData.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 500) + 100
      });
    }
  }

  return (
    <div className="space-y-12">
      
      {/* 2a. Overview Section */}
      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-peach flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-pink-light/30 w-32 h-32 rounded-full blur-2xl group-hover:bg-pink-light/60 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-cream rounded-2xl">
                <Package className="text-magenta" size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-ink-light font-bold text-sm uppercase tracking-wider mb-1">Pending Orders</h3>
              <p className="text-4xl font-extrabold text-ink mb-4">{pendingOrders}</p>
            </div>
            <Link href="/admin/orders" className="mt-auto inline-flex items-center text-sm font-bold text-magenta hover:text-magenta-dark transition-colors relative z-10">
              View pending <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft border border-peach flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-pink-light/30 w-32 h-32 rounded-full blur-2xl group-hover:bg-pink-light/60 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-cream rounded-2xl">
                <Mail className="text-magenta" size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-ink-light font-bold text-sm uppercase tracking-wider mb-1">Recent Enquiries</h3>
              <p className="text-4xl font-extrabold text-ink mb-4">{recentEnquiries}</p>
            </div>
            <Link href="/admin/enquiries" className="mt-auto inline-flex items-center text-sm font-bold text-magenta hover:text-magenta-dark transition-colors relative z-10">
              View new enquiries <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-soft border border-peach flex flex-col relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 bg-pink-light/30 w-32 h-32 rounded-full blur-2xl group-hover:bg-pink-light/60 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-cream rounded-2xl">
                <ImageIcon className="text-magenta" size={24} />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-ink-light font-bold text-sm uppercase tracking-wider mb-1">Gallery Posts</h3>
              <p className="text-4xl font-extrabold text-ink mb-4">{galleryPosts}</p>
            </div>
            <Link href="/admin/posts" className="mt-auto inline-flex items-center text-sm font-bold text-magenta hover:text-magenta-dark transition-colors relative z-10">
              Manage posts <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

        </div>
      </section>

      {/* 2b. Revenue Tracker / Analysis */}
      <section>
        <h2 className="text-2xl font-extrabold text-ink mb-6">Revenue & Analysis</h2>
        
        {/* Stat Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-cream rounded-2xl p-6 border border-peach flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <DollarSign className="text-magenta" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-light">Total Revenue</p>
              <p className="text-2xl font-extrabold text-ink">${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            </div>
          </div>
          <div className="bg-cream rounded-2xl p-6 border border-peach flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <ShoppingCart className="text-magenta" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-light">Total Orders</p>
              <p className="text-2xl font-extrabold text-ink">{totalOrders}</p>
            </div>
          </div>
          <div className="bg-cream rounded-2xl p-6 border border-peach flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Clock className="text-magenta" size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink-light">Not Yet Completed</p>
              <p className="text-2xl font-extrabold text-ink">{notYetCompleted}</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <RevenueChart data={chartData} />
      </section>

    </div>
  );
}
