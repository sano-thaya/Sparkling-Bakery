"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Eye, Image as ImageIcon, Pencil, X, CheckCircle, AlertTriangle } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const formRef = useRef<HTMLFormElement>(null);

  const isEditing = editTarget !== null;

  function handleEdit(post: Post) {
    setEditTarget(post);
    setErrorMsg("");
    setSuccessMsg("");
    // Scroll to form on mobile
    document.getElementById("post-form-panel")?.scrollIntoView({ behavior: "smooth" });
  }

  function cancelEdit() {
    setEditTarget(null);
    setErrorMsg("");
    setSuccessMsg("");
    formRef.current?.reset();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, action: (formData: FormData) => Promise<void>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    try {
      const formData = new FormData(e.currentTarget);
      await action(formData);
      setSuccessMsg(isEditing ? "Post updated successfully!" : "Post created successfully!");
      if (!isEditing) {
        e.currentTarget.reset();
      } else {
        setEditTarget(null);
      }
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
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
                  type="button"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2 text-sm font-bold">
                <CheckCircle size={16} />
                {successMsg}
              </div>
            )}
            
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertTriangle size={16} />
                {errorMsg}
              </div>
            )}

            {isEditing ? (
              /* ─── Edit form ─── */
              <form ref={formRef} onSubmit={(e) => handleSubmit(e, updatePostAction)} className="space-y-5">
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
                    className="input-field py-3 w-full"
                    required
                    defaultValue={editTarget.title}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="input-field py-3 w-full"
                    defaultValue={editTarget.category ?? ""}
                    placeholder="Wedding, Birthday..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Description</label>
                  <textarea
                    name="description"
                    className="input-field py-3 w-full min-h-[90px] resize-y"
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
                  <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary py-3 min-h-[44px] disabled:opacity-50">
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSubmitting}
                    className="px-4 py-3 min-h-[44px] border border-peach rounded-pill text-ink font-bold text-sm hover:bg-cream transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              /* ─── Create form ─── */
              <form ref={formRef} onSubmit={(e) => handleSubmit(e, createPostAction)} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Title *</label>
                  <input type="text" name="title" className="input-field py-3 w-full" required placeholder="Strawberry Vanilla Tier" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Category</label>
                  <input type="text" name="category" className="input-field py-3 w-full" placeholder="Wedding, Birthday..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-ink-light mb-2">Description</label>
                  <textarea name="description" className="input-field py-3 w-full min-h-[90px] resize-y" placeholder="Describe the flavors and design..." />
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
                  <button type="submit" disabled={isSubmitting} className="w-full btn-primary py-3 min-h-[44px] disabled:opacity-50">
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </button>
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
                      className="absolute top-3 right-12 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm p-2 rounded-full text-magenta hover:bg-magenta hover:text-white shadow-sm"
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
