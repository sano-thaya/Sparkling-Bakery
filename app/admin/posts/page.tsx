import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  async function createPost(formData: FormData) {
    "use server";
    // NOTE: In a real implementation with Cloudinary, we'd accept a file input here,
    // upload it to Cloudinary using their Node SDK or a presigned URL, and get the URL back.
    // For this demonstration, we'll assume the URL is provided directly as text.
    
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string; 

    await prisma.post.create({
      data: {
        title,
        category,
        description,
        imageUrls: imageUrl ? [imageUrl] : [],
      }
    });

    revalidatePath("/admin/posts");
    revalidatePath("/gallery");
  }

  async function deletePost(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/gallery");
  }

  return (
    <div>
      <h1 className="title-lg mb-6">Manage Gallery Posts</h1>

      <div className="grid grid-cols-2">
        <div className="card">
          <h2 className="mb-4">Create New Post</h2>
          <form action={createPost}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input type="text" name="title" className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Category (e.g. Wedding, Birthday)</label>
              <input type="text" name="category" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-textarea" rows={3}></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Image URL (Cloudinary integration placeholder)</label>
              <input type="text" name="imageUrl" className="form-input" placeholder="https://res.cloudinary.com/..." required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Publish Post</button>
          </form>
        </div>

        <div>
          <h2 className="mb-4">Published Posts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {posts.map(post => (
              <div key={post.id} className="card flex justify-between items-center" style={{ padding: '1rem' }}>
                <div>
                  <h4 style={{ margin: 0 }}>{post.title}</h4>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7, margin: 0 }}>{post.category}</p>
                </div>
                <form action={deletePost}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--color-rose)', cursor: 'pointer', fontWeight: 'bold' }}>
                    Delete
                  </button>
                </form>
              </div>
            ))}
            {posts.length === 0 && <p>No posts published yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
