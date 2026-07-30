import Link from "next/link";
import { Heart } from "lucide-react";

// Inline SVG social icons — avoids lucide-react version compatibility issues
const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-cream">
      {/* Top CTA Band */}
      <div className="bg-magenta py-10 px-6">
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-2xl font-extrabold mb-1">
              Ready to order your dream cake?
            </h3>
            <p className="text-white/80 font-medium">
              Custom creations baked with love — for every occasion.
            </p>
          </div>
          <Link
            href="/order"
            className="flex-shrink-0 px-8 py-4 bg-white text-magenta font-extrabold rounded-pill shadow-md hover:bg-cream transition-colors duration-300 text-lg"
          >
            Order Now →
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="font-serif text-3xl font-extrabold tracking-tight mb-4 inline-block">
              Sparkling <span className="text-magenta">Bakery</span>
            </Link>
            <p className="text-cream/70 max-w-sm text-sm leading-relaxed mt-4 mb-6">
              Handcrafted, bespoke cakes and pastries made with the finest ingredients. Every bite is a celebration.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-magenta transition-colors duration-300">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-magenta transition-colors duration-300">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-magenta transition-colors duration-300">
                <TwitterIcon />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-cream/50 mb-6">Explore</h4>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Gallery", href: "/gallery" },
                { label: "Custom Order", href: "/order" },
                { label: "Contact Us", href: "/enquiry" },
                { label: "My Orders", href: "/account/orders" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream/70 hover:text-white transition-colors duration-200 font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-widest text-cream/50 mb-6">Contact</h4>
            <ul className="space-y-3 text-sm text-cream/70">
              <li className="font-medium">hello@sparklingbakery.com</li>
              <li className="font-medium">Rapperswil-Jona,St.Gallen</li>
              <li className="font-medium mt-4 text-cream/50">Mon–Sat: 8am – 7pm</li>
              <li className="font-medium text-cream/50">Sunday: 10am – 4pm</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/40">
          <p className="flex items-center gap-1.5">
            © {currentYear} Sparkling Bakery. Made with <Heart size={12} className="text-magenta fill-magenta" /> All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
            <Link href="/enquiry" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
