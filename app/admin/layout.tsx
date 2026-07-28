import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: "250px", backgroundColor: "var(--color-plum)", color: "var(--color-white)", padding: "2rem 1rem" }}>
        <h2 style={{ color: "var(--color-peach)", marginBottom: "2rem" }}>Admin Panel</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/posts">Gallery Posts</Link>
          <Link href="/admin/enquiries">Enquiries</Link>
          <Link href="/" style={{ marginTop: "auto", opacity: 0.8 }}>← Back to Site</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: "2rem", backgroundColor: "#f9f9f9" }}>
        {children}
      </main>
    </div>
  );
}
