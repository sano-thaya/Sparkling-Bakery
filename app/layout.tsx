import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: "Sparkling Bakery | Premium Custom Cakes",
  description: "Handcrafted, bespoke cakes and pastries made with the finest ingredients and a touch of elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${fraunces.variable} font-sans bg-beige min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <PageTransition>
            <main className="flex-grow flex flex-col">
              {children}
            </main>
          </PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
