import Link from "next/link";
import { AnimatedSection, AnimatedCard } from "@/components/AnimatedSection";
import Image from "next/image";
import { Star, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function Home() {
  // Fetch latest 3 gallery posts for "Previous Work" section
  let recentPosts: { id: string; title: string; category: string | null; imageUrls: string[] }[] = [];
  try {
    recentPosts = await prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, category: true, imageUrls: true },
    });
  } catch (e) {
    console.error("Could not fetch recent posts:", e);
  }

  return (
    <div className="flex-grow flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden bg-gradient-diagonal">
        <AnimatedSection className="container-custom relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <span className="inline-block py-1.5 px-4 rounded-pill bg-white/80 backdrop-blur-sm text-magenta font-bold text-sm mb-6 shadow-sm border border-pink">
                🍰 Freshly Baked Custom Cakes
              </span>
              <h1 className="text-6xl md:text-[5.5rem] font-sans font-extrabold tracking-tighter leading-[0.95] mb-8">
                <span className="block text-ink">Premium</span>
                <span className="block text-magenta">Bakery</span>
                <span className="block text-pink font-light italic">Experience</span>
              </h1>
              <div className="bg-white/60 p-6 rounded-3xl backdrop-blur-sm border border-white/80 shadow-soft mb-8 max-w-lg">
                <h2 className="font-serif text-3xl font-bold italic text-rose-deep mb-3">Baked to Bless</h2>
                <p className="text-ink-light font-medium leading-relaxed">
                  Every celebration deserves something undeniably sweet. We deliver bold flavors that surprise and delight, baked fresh daily.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 items-center">
                <Link href="/order" className="btn-primary">Order a Custom Cake</Link>
                <Link href="/gallery" className="btn-secondary">View Collection</Link>
              </div>
            </div>

            <div className="relative">
              <AnimatedCard index={1} className="relative aspect-[4/5] w-full max-w-lg mx-auto bg-white rounded-[3rem] p-4 shadow-elevated border border-peach">
                <div className="w-full h-full bg-peach/30 rounded-[2.5rem] overflow-hidden relative flex items-center justify-center flex-col">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink/20 to-transparent" />
                  <div className="z-10 text-center p-8">
                    <span className="text-6xl mb-4 block">🎂</span>
                    <h3 className="font-serif text-2xl font-bold text-rose-deep italic">Our Signature Stack</h3>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </AnimatedSection>
      </section>



      {/* Previous Work Section */}
      {recentPosts.length > 0 && (
        <section className="py-32 bg-cream relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-pink-light/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-peach/40 rounded-full blur-3xl" />
          <div className="container-custom relative z-10">
            <AnimatedSection className="text-center mb-16">
              <span className="inline-block py-1.5 px-4 rounded-pill bg-white text-magenta font-bold text-sm mb-4 shadow-sm border border-pink">
                ✨ Our Creations
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">PREVIOUS WORK</h2>
              <p className="text-ink-light font-medium max-w-xl mx-auto">
                Every cake tells a story. Here's a glimpse of what we've created for our customers.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentPosts.map((post, i) => (
                <AnimatedCard key={post.id} index={i}>
                  <Link href={`/gallery/${post.id}`} className="block group">
                    <div className="bg-white rounded-3xl overflow-hidden shadow-soft border border-peach hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                      <div className="relative aspect-square bg-peach/20 overflow-hidden">
                        {post.imageUrls?.[0] ? (
                          <Image
                            src={post.imageUrls[0]}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-6xl">🎂</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-bold text-magenta uppercase tracking-wider mb-1">{post.category || "Creation"}</p>
                        <h3 className="font-extrabold text-ink text-lg group-hover:text-magenta transition-colors">{post.title}</h3>
                      </div>
                    </div>
                  </Link>
                </AnimatedCard>
              ))}
            </div>

            {/* Centered Order Now Button */}
            <AnimatedSection delay={0.2} className="text-center">
              <p className="text-ink-light font-medium mb-6 text-lg">
                Love what you see? Let us create something magical just for you.
              </p>
              <Link
                href="/order"
                className="inline-flex items-center gap-3 px-10 py-5 bg-magenta text-white font-extrabold text-xl rounded-pill shadow-bloom hover:bg-rose-deep hover:scale-105 transition-all duration-300"
              >
                Order Now
                <ArrowRight size={22} />
              </Link>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-4">WHAT PEOPLE THINK ABOUT US</h2>
            <p className="text-ink-light font-medium max-w-2xl mx-auto">
              Every celebration deserves something unforgettable. See what our customers are saying!
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Jenny Blake", text: "The cake looked absolutely beautiful and tasted even better! Fresh, soft, and perfectly balanced." },
              { name: "Cameron William", text: "Best bakery in town! The croissants are exactly like the ones I had in Paris." },
              { name: "Leslie Alex", text: "Ordered a custom cake for my daughter's birthday. The team was so easy to work with!" },
              { name: "Ronald Richards", text: "Absolutely stunning presentation. The chocolate fudge is out of this world." },
            ].map((review, i) => (
              <AnimatedCard key={i} index={i}>
                <div className="bg-cream p-6 rounded-3xl shadow-soft h-full border border-peach/30">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-magenta rounded-full flex items-center justify-center text-white font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-ink text-sm">{review.name}</h4>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={10} className="fill-magenta text-magenta" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-ink-light leading-relaxed">"{review.text}"</p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
