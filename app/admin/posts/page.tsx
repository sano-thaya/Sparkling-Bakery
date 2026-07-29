import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import { Eye, Image as ImageIcon } from "lucide-react";
import { DeletePostButton } from "@/components/DeletePostButton";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  let posts: { id: string; title: string; category: string | null; imageUrls: string[]; views: number; description: string | null }[] = [];
  try {
    posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("Could not load posts:", e);
  }

  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = "";

    if (imageFile && imageFile.size > 0) {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        imageUrl = await new Promise<string>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "sparkling-bakery" }, (error, result) => {
              if (error || !result) reject(error);
              else resolve(result.secure_url);
            })
            .end(buffer);
        });
      } catch (uploadErr) {
        console.error("Cloudinary upload failed:", uploadErr);
      }
    }

    await prisma.post.create({
      data: {
        title,
        category: category || null,
        description: description || null,
        imageUrls: imageUrl ? [imageUrl] : [],
      },
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Manage Gallery Posts</h1>
        <p className="text-ink-light">Add new creations to your public gallery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Create Post Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-peach sticky top-28">
            <h2 className="text-xl font-bold mb-6 text-ink border-b border-peach pb-4">Create New Post</h2>
            <form action={createPost} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-ink-light mb-2">Title *</label>
                <input type="text" name="title" className="input-field py-2.5" required placeholder="Strawberry Vanilla Tier" />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink-light mb-2">Category</label>
                <input type="text" name="category" className="input-field py-2.5" placeholder="Wedding, Birthday..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-ink-light mb-2">Description</label>
                <textarea name="description" className="input-field py-2.5 min-h-[90px] resize-y" placeholder="Describe the flavors and design..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-ink-light mb-2">Upload Image *</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full text-sm text-ink-light file:mr-4 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-bold file:bg-peach/50 file:text-ink hover:file:bg-peach/80 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full btn-primary py-3">Publish Post</button>
              </div>
            </form>
          </div>
        </div>

        {/* Post Grid */}
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <div className="bg-cream border border-peach rounded-3xl p-12 text-center">
              <ImageIcon className="mx-auto text-peach mb-4" size={48} />
              <p className="text-ink-light font-bold">No posts published yet. Create your first one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-peach flex flex-col group relative">
                  <div className="relative aspect-square bg-pink-light">
                    {post.imageUrls?.[0] ? (
                      <Image
                        src={post.imageUrls[0]}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">🎂</div>
                    )}

                    {/* View Count Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-pill flex items-center gap-1.5 text-xs font-bold text-ink shadow-sm">
                      <Eye size={12} className="text-magenta" /> {post.views ?? 0}
                    </div>

                    {/* Delete Button — Client Component */}
                    <DeletePostButton id={post.id} action={deletePost} />
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs font-bold text-magenta uppercase tracking-wider mb-1">{post.category || "Uncategorized"}</p>
                    <h4 className="font-bold text-ink mb-1 truncate">{post.title}</h4>
                    {post.description && (
                      <p className="text-xs text-ink-light line-clamp-2">{post.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
