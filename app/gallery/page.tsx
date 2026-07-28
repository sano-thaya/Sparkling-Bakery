import { prisma } from "@/lib/prisma";
import Image from "next/image";

export const revalidate = 60; // Revalidate every minute

export default async function GalleryPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container section">
      <h1 className="title-xl text-center mb-8">Our Creations</h1>
      
      {posts.length === 0 ? (
        <p className="text-center text-lead">No gallery posts available yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="card p-0" style={{ overflow: "hidden", padding: 0 }}>
              <div style={{ position: "relative", width: "100%", aspectRatio: "4/4" }}>
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <Image 
                    src={post.imageUrls[0]} 
                    alt={post.title} 
                    fill 
                    style={{ objectFit: "cover" }} 
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", backgroundColor: "var(--color-peach)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4" style={{ padding: "1.5rem" }}>
                {post.category && (
                  <span style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-rose)" }}>
                    {post.category}
                  </span>
                )}
                <h3 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>{post.title}</h3>
                {post.description && <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>{post.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
