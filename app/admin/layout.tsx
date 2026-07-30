"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Enquiries", href: "/admin/enquiries" },
    { name: "Posts", href: "/admin/posts" },
  ];

  return (
    <div className="min-h-screen bg-beige flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-beige-dark shadow-sm md:min-h-[calc(100vh-80px)]">
        <div className="p-6 h-full flex flex-col">
          <h2 className="font-serif text-xl font-bold text-brown mb-8">Admin Panel</h2>
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive
                    ? "bg-magenta text-white shadow-md"
                    : "text-brown-light hover:bg-beige hover:text-brown"
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-beige mt-auto">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        <div className="bg-white rounded-2xl shadow-sm border border-beige-dark p-6 md:p-8 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
