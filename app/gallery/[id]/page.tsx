"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function SinglePostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We could fetch the full post data here, but for simplicity we'll just hit the view endpoint 
    // and assume the user came from the gallery. Wait, we need the post data to render it.
    // Let's create a GET endpoint for the post, or just use a Server Component.
    // Actually, Server Component is better for fetching data, but we need to trigger the POST API on load.
    
    // Let's just fetch the data and trigger the view count
    fetch(`/api/posts/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setLoading(false);
        // Trigger view count
        fetch(`/api/posts/${params.id}/view`, { method: "POST" });
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return <div className="min-h-screen bg-cream flex items-center justify-center">Post not found.</div>;
  }

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 relative">
      <div className="container-custom">
        <Link href="/gallery" className="inline-flex items-center gap-2 text-ink-light font-bold hover:text-magenta transition-colors mb-8">
          <ArrowLeft size={20} /> Back to Gallery
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row"
        >
          <div className="w-full md:w-1/2 relative aspect-square bg-pink-light">
            {post.imageUrls && post.imageUrls.length > 0 ? (
              <Image
                src={post.imageUrls[0]}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized={!post.imageUrls[0].startsWith("https://res.cloudinary.com")}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-peach/30 text-magenta font-serif text-2xl italic">
                No Image
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
            {post.category && (
              <div className="inline-block bg-magenta text-white px-3 py-1.5 rounded-pill text-xs font-bold tracking-wider mb-4 w-fit">
                {post.category}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm font-bold text-ink-light mb-6">
              <span className="flex items-center gap-1.5"><Clock size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5 text-magenta"><Eye size={16} /> {post.views + 1} Views</span>
            </div>
            
            {post.description && (
              <p className="text-lg text-ink-light leading-relaxed font-medium mb-8">
                {post.description}
              </p>
            )}
            
            <div className="mt-auto pt-8 border-t border-peach">
              <Link href="/order" className="btn-primary w-full block text-center">
                Order Something Similar
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
