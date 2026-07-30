"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: string;
  title: string;
  category: string | null;
  imageUrls: string[];
}

interface HeroProps {
  recentPosts: Post[];
}

const DEFAULT_IMAGES = [
  "https://res.cloudinary.com/ycklbrs4/image/upload/v1785385129/WhatsApp_Image_2026-07-29_at_7.27.19_PM_8_mskie7.jpg",
  "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80",
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
];

export default function Hero({ recentPosts }: HeroProps) {
  // Combine DB images with defaults to guarantee we have at least 3 slides
  const dbImages = recentPosts.flatMap((post) => post.imageUrls).filter(Boolean);
  const carouselImages =
    dbImages.length >= 3
      ? dbImages
      : [...dbImages, ...DEFAULT_IMAGES.slice(dbImages.length)];

  const [activeIndex, setActiveIndex] = useState(0);

  // Auto rotate the carousel every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselImages.length);
  };

  const getCardPosition = (idx: number) => {
    if (idx === activeIndex) return "center";
    if (idx === (activeIndex - 1 + carouselImages.length) % carouselImages.length) return "left";
    if (idx === (activeIndex + 1) % carouselImages.length) return "right";
    return "hidden";
  };

  const handleCardClick = (idx: number) => {
    const pos = getCardPosition(idx);
    if (pos === "left") {
      handlePrev();
    } else if (pos === "right") {
      handleNext();
    }
  };

  // 3D variants for Framer Motion
  const cardVariants = {
    left: {
      x: "-28%",
      scale: 0.85,
      rotateY: 35,
      z: -100,
      opacity: 0.65,
      zIndex: 10,
      pointerEvents: "auto" as const,
    },
    center: {
      x: "0%",
      scale: 1.02,
      rotateY: 0,
      z: 100,
      opacity: 1,
      zIndex: 30,
      pointerEvents: "auto" as const,
    },
    right: {
      x: "28%",
      scale: 0.85,
      rotateY: -35,
      z: -100,
      opacity: 0.65,
      zIndex: 10,
      pointerEvents: "auto" as const,
    },
    hidden: {
      x: "0%",
      scale: 0.5,
      rotateY: 0,
      z: -200,
      opacity: 0,
      zIndex: 0,
      pointerEvents: "none" as const,
    },
  };

  // Staggered entry animation variants for text container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 90,
        damping: 15,
      },
    },
  } as const;

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-24 overflow-hidden bg-gradient-diagonal">
      {/* ── DECORATIVE FLOATING ACCENTS ── */}
      {/* Glowing Orb Behind Carousel */}
      <div className="absolute top-[25%] right-[10%] w-[350px] h-[350px] bg-pink-light/35 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] left-[5%] w-[300px] h-[300px] bg-peach/40 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Floating Whisk 1 (Top Left/Center) */}
      <motion.div
        className="absolute top-[12%] left-[42%] opacity-35 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, -18, 0],
          rotate: [0, 8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="55" height="55" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M32 8 C22 8, 18 24, 18 36 C18 42, 22 46, 32 46 C42 46, 46 42, 46 36 C46 24, 42 8, 32 8 Z"
            stroke="#F6A8C4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 8 C26 8, 22 24, 22 36 C22 41, 26 44, 32 44 C38 44, 42 41, 42 36 C42 24, 38 8, 32 8 Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 8 C30 8, 28 24, 28 36 C28 40, 30 42, 32 42 C34 42, 36 40, 36 36 C36 24, 34 8, 32 8 Z"
            stroke="#F6A8C4"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="27" y="44" width="10" height="4" rx="1" fill="#FFF8F3" />
          <rect x="29" y="48" width="6" height="14" rx="2" fill="#E29A7A" />
        </svg>
      </motion.div>

      {/* Floating Rolling Pin 1 (Top Right) */}
      <motion.div
        className="absolute top-[15%] right-[6%] opacity-35 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, 16, 0],
          rotate: [15, 23, 15],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="75" height="75" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="28" width="10" height="8" rx="2" fill="#9C523A" />
          <path d="M12 30 H14 V34 H12 Z" fill="#78350F" />
          <rect x="14" y="22" width="36" height="20" rx="3" fill="#E29A7A" />
          <path d="M50 30 H52 V34 H50 Z" fill="#78350F" />
          <rect x="52" y="28" width="10" height="8" rx="2" fill="#9C523A" />
        </svg>
      </motion.div>

      {/* Floating Whisk 2 (Bottom Center/Left) */}
      <motion.div
        className="absolute bottom-[10%] left-[45%] opacity-35 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, 14, 0],
          rotate: [-10, -2, -10],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="50" height="50" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M32 8 C22 8, 18 24, 18 36 C18 42, 22 46, 32 46 C42 46, 46 42, 46 36 C46 24, 42 8, 32 8 Z"
            stroke="#F6A8C4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M32 8 C26 8, 22 24, 22 36 C22 41, 26 44, 32 44 C38 44, 42 41, 42 36 C42 24, 38 8, 32 8 Z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M32 8 C30 8, 28 24, 28 36 C28 40, 30 42, 32 42 C34 42, 36 40, 36 36 C36 24, 34 8, 32 8 Z"
            stroke="#F6A8C4"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect x="27" y="44" width="10" height="4" rx="1" fill="#FFF8F3" />
          <rect x="29" y="48" width="6" height="14" rx="2" fill="#E29A7A" />
        </svg>
      </motion.div>

      {/* Floating Rolling Pin 2 (Bottom Right) */}
      <motion.div
        className="absolute bottom-[10%] right-[3%] opacity-35 hidden md:block z-0 pointer-events-none"
        animate={{
          y: [0, -14, 0],
          rotate: [-25, -18, -25],
        }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="70" height="70" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="28" width="10" height="8" rx="2" fill="#9C523A" />
          <path d="M12 30 H14 V34 H12 Z" fill="#78350F" />
          <rect x="14" y="22" width="36" height="20" rx="3" fill="#E29A7A" />
          <path d="M50 30 H52 V34 H50 Z" fill="#78350F" />
          <rect x="52" y="28" width="10" height="8" rx="2" fill="#9C523A" />
        </svg>
      </motion.div>

      {/* Sparkles (Bottom Right) */}
      <motion.div
        className="absolute bottom-[16%] right-[8%] opacity-45 hidden md:block z-0 pointer-events-none"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" fill="#F6A8C4" />
        </svg>
      </motion.div>

      {/* Sparkles (Top Left) */}
      <motion.div
        className="absolute top-[28%] left-[2%] opacity-35 hidden md:block z-0 pointer-events-none"
        animate={{
          scale: [0.9, 1.15, 0.9],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" fill="#F9C6D7" />
        </svg>
      </motion.div>

      {/* ── HERO CONTAINER ── */}
      <div className="container-custom relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Typography and CTAs */}
          <motion.div
            className="text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="inline-block py-1.5 px-4 rounded-pill bg-white/85 backdrop-blur-md text-magenta font-bold text-sm mb-6 shadow-sm border border-pink/60"
              variants={itemVariants}
            >
              🍰 Freshly Baked Custom Cakes
            </motion.span>
            
            <motion.h1
              className="text-6xl md:text-[5.5rem] font-sans font-extrabold tracking-tighter leading-[0.95] mb-8"
              variants={itemVariants}
            >
              <span className="block text-ink">Premium</span>
              <span className="block text-magenta">Bakery</span>
              <span className="block text-pink font-light italic">Experience</span>
            </motion.h1>

            <motion.div
              className="bg-white/55 p-6 rounded-3xl backdrop-blur-md border border-white/70 shadow-soft mb-8 max-w-lg"
              variants={itemVariants}
            >
              <h2 className="font-serif text-3xl font-bold italic text-rose-deep mb-3">Baked to Bless</h2>
              <p className="text-ink-light font-medium leading-relaxed">
                Every celebration deserves something undeniably sweet. We deliver bold flavors that surprise and delight, baked fresh daily.
              </p>
            </motion.div>

            <motion.div className="flex flex-wrap gap-4 items-center" variants={itemVariants}>
              <Link
                href="/order"
                className="relative px-8 py-4 rounded-pill bg-gradient-to-r from-magenta to-pink text-white font-bold shadow-bloom overflow-hidden hover:scale-105 hover:shadow-[0_0_25px_rgba(214,51,139,0.55)] active:scale-95 transition-all duration-300 group inline-block"
              >
                <span className="relative z-10">Order a Custom Cake</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </Link>
              
              <Link href="/gallery" className="btn-secondary">
                View Collection
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Image Carousel / Stack */}
          <div className="relative flex flex-col items-center justify-center">
            {/* 3D Stack Container */}
            <div
              className="relative w-full h-[400px] md:h-[480px] lg:h-[520px] flex items-center justify-center select-none"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }}
            >
              <AnimatePresence mode="popLayout">
                {carouselImages.map((imageUrl, idx) => {
                  const position = getCardPosition(idx);
                  if (position === "hidden") return null;

                  const isCenter = position === "center";

                  return (
                    <motion.div
                      key={`${imageUrl}-${idx}`}
                      className="absolute w-[70%] h-[90%] md:w-[65%] md:h-[92%] rounded-[2.2rem] overflow-hidden cursor-pointer"
                      initial={false}
                      animate={position}
                      variants={cardVariants}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 18,
                      }}
                      onClick={() => handleCardClick(idx)}
                      style={{
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <div
                        className={`w-full h-full relative rounded-[2.2rem] overflow-hidden transition-all duration-500 bg-peach/10 backdrop-blur-[2px]
                          ${
                            isCenter
                              ? "border-4 border-white/95 shadow-[0_20px_50px_rgba(122,31,75,0.22)]"
                              : "border-2 border-white/60 shadow-soft hover:border-white/90"
                          }
                        `}
                      >
                        <Image
                          src={imageUrl}
                          alt={`Carousel image ${idx + 1}`}
                          fill
                          className="object-cover"
                          priority={idx === 0}
                          sizes="(max-width: 768px) 70vw, 40vw"
                          unoptimized
                        />
                        {/* Soft visual overlays */}
                        {!isCenter && (
                          <div className="absolute inset-0 bg-ink/15 transition-opacity duration-500 hover:opacity-0" />
                        )}
                        {isCenter && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-pink/15 to-transparent pointer-events-none" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Sleek Floating Arrow Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-0 md:-left-4 z-40 w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white/80 text-magenta flex items-center justify-center shadow-soft hover:bg-white/85 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 md:-right-4 z-40 w-12 h-12 rounded-full bg-white/50 backdrop-blur-md border border-white/80 text-magenta flex items-center justify-center shadow-soft hover:bg-white/85 hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Bottom Pagination Indicators */}
            <div className="flex items-center gap-2 mt-6 z-40">
              <button
                onClick={handlePrev}
                className="text-magenta/60 hover:text-magenta transition-colors mr-1"
                aria-label="Previous index"
              >
                <ChevronLeft size={16} />
              </button>

              {carouselImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    idx === activeIndex
                      ? "w-6 bg-magenta shadow-[0_0_10px_rgba(214,51,139,0.4)]"
                      : "w-2 bg-pink-light hover:bg-pink"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}

              <button
                onClick={handleNext}
                className="text-magenta/60 hover:text-magenta transition-colors ml-1"
                aria-label="Next index"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
