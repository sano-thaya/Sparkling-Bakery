"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    } else {
      // Refresh router and let the middleware/layout handle the redirect based on session
      // For immediate perceived feedback, we just push to home, and if admin, they can navigate 
      // or we can fetch session to check role. For simplicity, next-auth handles redirect via callbackUrl usually, 
      // but here we'll just push to home and if they are an admin, the Navbar shows Admin Panel link.
      // Wait, the prompt says: "After successful login, check the user's role and redirect: admin -> /admin, customer -> /"
      
      // Let's do a quick fetch to our own session endpoint to check role
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      
      router.refresh();
    }
  };

  return (
    <div className="bg-gradient-diagonal min-h-screen py-24 flex items-center justify-center relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="container-custom max-w-md relative z-10 w-full"
      >
        <div className="card p-10 text-center">
          <h1 className="text-3xl font-bold mb-2 text-ink">Welcome Back</h1>
          <p className="text-ink-light mb-8 text-sm">Please sign in to continue</p>
          
          {registered && (
            <div className="mb-6 text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              Account created! You can now log in.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="label-text" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="label-text" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            
            {error && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-light">
            Don't have an account? <Link href="/signup" className="text-magenta font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream"></div>}>
      <LoginForm />
    </Suspense>
  );
}
