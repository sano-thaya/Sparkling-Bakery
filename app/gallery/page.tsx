import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import { Eye, Clock } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];

  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Gallery: failed to load posts", err);
  }

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

  return (
    <div className="bg-cream min-h-screen pt-32 pb-24 relative">
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-diagonal opacity-30 z-0"></div>

      <div className="container-custom relative z-10">
        <AnimatedSection className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-ink mb-6">Our Creations</h1>
          <p className="text-magenta font-medium max-w-2xl mx-auto text-lg">
            A curated selection of our finest bespoke cakes, handcrafted to perfection.
          </p>
        </AnimatedSection>


        {posts.length === 0 ? (
          <AnimatedSection delay={0.2}>
            <div className="card p-12 text-center max-w-2xl mx-auto border border-peach">
              <span className="text-4xl mb-4 block">👩‍🍳</span>
              <p className="text-lg font-medium text-ink-light">
                No gallery posts available yet. Check back soon for sweet inspiration!
              </p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <AnimatedCard key={post.id} index={index} className="group cursor-pointer">
                <Link href={`/gallery/${post.id}`} className="block h-full">
                  <div className="card overflow-hidden h-full flex flex-col group-hover:-translate-y-1 transition-all duration-300">
                    <div className="relative w-full aspect-square overflow-hidden bg-pink-light">
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-pill shadow-sm z-10 flex items-center gap-1.5 text-xs font-bold text-ink">
                        <Eye size={14} className="text-magenta" />
                        {post.views || 0}
                      </div>

                      {post.category && (
                        <div className="absolute top-4 left-4 bg-magenta text-white px-3 py-1.5 rounded-pill shadow-sm z-10 text-xs font-bold tracking-wider">
                          {post.category}
                        </div>
                      )}

                      {post.imageUrls && post.imageUrls.length > 0 ? (
                        <Image
                          src={post.imageUrls[0]}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                          unoptimized={!post.imageUrls[0].startsWith("https://res.cloudinary.com")}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-peach/30 text-magenta font-serif text-2xl italic">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-6 bg-white flex-grow flex flex-col justify-center text-center">
                      <h3 className="text-xl font-extrabold mb-3 text-ink group-hover:text-magenta transition-colors duration-200">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-sm text-ink-light line-clamp-2 mb-4 font-medium">{post.description}</p>
                      )}
                      <div className="mt-auto flex items-center justify-center gap-1 text-xs font-bold text-ink/50">
                        <Clock size={12} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimatedCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
