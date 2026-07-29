"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { User, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
      setIsDropdownOpen(false); // Close dropdown on scroll
    } else {
      setHidden(false);
    }
    setIsScrolled(latest > 20);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-peach" : "bg-transparent"
        }`}
    >
      <div className="container-custom h-20 flex items-center justify-between">
        <Link href="/" className="font-serif text-3xl font-extrabold tracking-tight text-ink">
          Sparkling <span className="text-magenta">Bakery</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-bold text-ink">
          <Link href="/" className="hover:text-magenta transition-colors duration-200">Home</Link>
          <Link href="/gallery" className="hover:text-magenta transition-colors duration-200">Gallery</Link>
          <Link href="/enquiry" className="hover:text-magenta transition-colors duration-200">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/order" className="hidden sm:inline-block px-6 py-2.5 rounded-pill border-2 border-magenta text-magenta font-bold hover:bg-magenta hover:text-white transition-all duration-300">
            Order Now
          </Link>

          {session ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-pill border border-peach bg-white hover:bg-peach/30 transition-colors shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-magenta text-white flex items-center justify-center font-bold text-sm">
                  {session.user?.name?.charAt(0) || <User size={16} />}
                </div>
                <ChevronDown size={16} className="text-ink-light" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-elevated border border-peach overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-peach bg-cream">
                      <p className="text-sm font-bold text-ink truncate">{session.user?.name}</p>
                      <p className="text-xs text-ink-light truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      {(session.user as any)?.role === "admin" && (
                        <Link href="/admin" className="px-3 py-2 text-sm font-bold text-ink hover:bg-peach/30 rounded-lg transition-colors">
                          Admin Dashboard
                        </Link>
                      )}
                      <Link href="/account/orders" className="px-3 py-2 text-sm font-bold text-ink hover:bg-peach/30 rounded-lg transition-colors">
                        My Orders
                      </Link>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-left px-3 py-2 text-sm font-bold text-rose-deep hover:bg-rose-deep/10 rounded-lg transition-colors"
                      >
                        Log out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="px-4 py-2 rounded-pill font-bold text-ink hover:bg-peach/50 transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="px-5 py-2.5 rounded-pill bg-magenta text-white font-bold hover:bg-magenta-dark transition-colors shadow-sm hidden sm:block">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
