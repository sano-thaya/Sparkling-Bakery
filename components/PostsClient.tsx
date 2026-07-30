"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, Image as ImageIcon, Pencil, X } from "lucide-react";
import { DeletePostButton } from "@/components/DeletePostButton";

type Post = {
  id: string;
  title: string;
  category: string | null;
  imageUrls: string[];
  views: number;
  description: string | null;
};

export default function PostsClient({
  posts,
  createPostAction,
  updatePostAction,
  deletePostAction,
}: {
  posts: Post[];
  createPostAction: (formData: FormData) => Promise<void>;
  updatePostAction: (formData: FormData) => Promise<void>;
  deletePostAction: (formData: FormData) => Promise<void>;
}) {
  const [editTarget, setEditTarget] = useState<Post | null>(null);

  const isEditing = editTarget !== null;

  function handleEdit(post: Post) {
    setEditTarget(post);
    // Scroll to form on mobile
    document.getElementById("post-form-panel")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() {
    setEditTarget(null);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Manage Gallery Posts</h1>
        <p className="text-ink-light">Add, edit, or remove creations from your public gallery.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Create / Edit Form */}
        <div className="lg:col-span-1" id="post-form-panel">
          <div className="bg-white rounded-3xl shadow-soft p-6 border border-peach sticky top-28">
            <div className="flex items-center justify-between mb-6 border-b border-peach pb-4">
              <h2 className="text-xl font-bold text-ink">
                {isEditing ? "Edit Post" : "Create New Post"}
              </h2>
              {isEditing && (
                <button
                  onClick={cancelEdit}
                  className="p-1.5 rounded-lg text-ink-light hover:text-ink hover:bg-cream transition-colors"
                  title="Cancel edit"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {isEditing ? (
              /* ─── Edit form ─── */
              <form action={updatePostAction} className="space-y-5">
                <input type="hidden" name="id" value={editTarget.id} />
                {/* Current image preview */}
                {editTarget.imageUrls[0] && (
                  <div className="rounded-2xl overflow-hidden aspect-square relative mb-2">
                    <Image
                      src={editTarget.imageUrls[0]}
                      alt={editTarget.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-3">
                      <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-lg">Current image</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="input-field py-2.5"
                    required
                    defaultValue={editTarget.title}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="input-field py-2.5"
                    defaultValue={editTarget.category ?? ""}
                    placeholder="Wedding, Birthday..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Description</label>
                  <textarea
                    name="description"
                    className="input-field py-2.5 min-h-[90px] resize-y"
                    defaultValue={editTarget.description ?? ""}
                    placeholder="Describe the flavors and design..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">
                    Replace Image <span className="font-normal text-ink-light/70">(optional)</span>
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full text-sm text-ink-light file:mr-4 file:py-2 file:px-4 file:rounded-pill file:border-0 file:text-sm file:font-bold file:bg-peach/50 file:text-ink hover:file:bg-peach/80 transition-colors"
                  />
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="submit" className="flex-1 btn-primary py-3">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-3 border border-peach rounded-pill text-ink font-bold text-sm hover:bg-cream transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* ─── Create form ─── */
              <form action={createPostAction} className="space-y-5">
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
                  <textarea name="description" className="input-field py-2.5 min-h-[90px] resize-y" placeholder="Describe the flavors and design..." />
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
            )}
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
                <div
                  key={post.id}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col group relative transition-all ${
                    editTarget?.id === post.id ? "border-magenta ring-2 ring-magenta/30" : "border-peach"
                  }`}
                >
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

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(post)}
                      title="Edit post"
                      className="absolute top-3 right-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-2 rounded-full text-magenta hover:bg-magenta hover:text-white transition-colors shadow-sm"
                    >
                      <Pencil size={15} />
                    </button>

                    {/* Delete Button */}
                    <DeletePostButton id={post.id} action={deletePostAction} />
                  </div>

                  <div className="p-4 flex-grow flex flex-col">
                    <p className="text-xs font-bold text-magenta uppercase tracking-wider mb-1">
                      {post.category || "Uncategorized"}
                    </p>
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
