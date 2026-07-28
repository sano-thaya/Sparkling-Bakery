import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Sparkling Bakery",
  description: "Custom cake orders and gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        <header className="site-header">
          <div className="header-content">
            <Link href="/" className="logo">
              Sparkling Bakery
            </Link>
            <nav className="main-nav">
              <Link href="/">Home</Link>
              <Link href="/gallery">Gallery</Link>
              <Link href="/order">Order</Link>
              <Link href="/enquiry">Contact</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <p>&copy; {new Date().getFullYear()} Sparkling Bakery. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
