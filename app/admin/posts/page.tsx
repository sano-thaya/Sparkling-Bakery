import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import PostsClient from "@/components/PostsClient";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

async function uploadToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "sparkling-bakery" }, (error, result) => {
        if (error || !result) reject(error);
        else resolve(result.secure_url);
      })
      .end(buffer);
  });
}

export default async function AdminPostsPage() {
  let posts: {
    id: string;
    title: string;
    category: string | null;
    imageUrls: string[];
    views: number;
    description: string | null;
  }[] = [];

  try {
    posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  } catch (e) {
    console.error("Could not load posts:", e);
  }

  // ── Create ─────────────────────────────────────────────────────
  async function createPost(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      try {
        imageUrl = await uploadToCloudinary(imageFile);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
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

  // ── Update ─────────────────────────────────────────────────────
  async function updatePost(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("image") as File;

    // Only upload if admin chose a new file
    let newImageUrl: string | null = null;
    if (imageFile && imageFile.size > 0) {
      try {
        newImageUrl = await uploadToCloudinary(imageFile);
      } catch (err) {
        console.error("Cloudinary upload failed:", err);
      }
    }

    // Fetch existing post to retain old image if no new one provided
    const existing = await prisma.post.findUnique({ where: { id } });
    const imageUrls = newImageUrl
      ? [newImageUrl]
      : (existing?.imageUrls ?? []);

    await prisma.post.update({
      where: { id },
      data: {
        title,
        category: category || null,
        description: description || null,
        imageUrls,
      },
    });

    revalidatePath("/admin/posts");
    revalidatePath("/gallery");
  }

  // ── Delete ─────────────────────────────────────────────────────
  async function deletePost(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await prisma.post.delete({ where: { id } });
    revalidatePath("/admin/posts");
    revalidatePath("/gallery");
  }

  return (
    <PostsClient
      posts={posts}
      createPostAction={createPost}
      updatePostAction={updatePost}
      deletePostAction={deletePost}
    />
  );
}
