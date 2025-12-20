"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Background from "@/components/sections/bg_login";

const isStrongPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const verified = params.get("verified");

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    if (!isLogin && !isStrongPassword(form.password)) {
      setError("Use 8+ chars with upper, lower, number & symbol");
      setLoading(false);
      return;
    }

    const endpoint = isLogin
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email: form.email, password: form.password }
            : form
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        router.push("/"); // redirect to home
      } else {
        setInfo("📩 Verify your email to activate your account");
        setForm({ name: "", email: "", password: "" });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
    {/* 🌌 Animated Canvas Background */}
    <div className="absolute inset-0 z-0">
      <Background />
    </div>

    {/* 🧱 Main Layout */}
    <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl">

        {/* ───────────────────────── LEFT: Brand Panel ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex flex-col justify-center"
        >
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Built for<br />
            <span className="text-[#ff7400]">Craft</span>, Quality<br />
            & Experience
          </h1>

          <p className="text-gray-400 text-lg max-w-md mb-10">
            Rabuste is designed for creators and professionals who value
            durability, precision, and long-term excellence.
          </p>

          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-center gap-3">
              <span className="text-[#ff7400]">●</span>
              Premium-grade systems
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#ff7400]">●</span>
              Trusted by growing teams
            </li>
            <li className="flex items-center gap-3">
              <span className="text-[#ff7400]">●</span>
              Designed for longevity
            </li>
          </ul>
        </motion.div>

        {/* ───────────────────────── RIGHT: Auth Card ───────────────────────── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md mx-auto
            bg-black/70 backdrop-blur-xl
            border border-[#2a2a2a]
            rounded-2xl p-8 shadow-2xl"
        >

          {/* Brand */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold tracking-wide">Rabuste</h1>
            <p className="text-sm text-gray-400 mt-1">
              Craft • Quality • Experience
            </p>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-center mb-4">
            {isLogin ? "Welcome Back" : "Create your account"}
          </h2>

          {verified && (
            <p className="text-green-400 text-sm text-center mb-4">
              ✅ Email verified. Please login.
            </p>
          )}

          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          {info && <p className="text-yellow-300 text-sm mb-3">{info}</p>}

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              required
              value={form.name}
              onChange={handleChange}
              className="auth-input"
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={handleChange}
            className="auth-input"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="auth-input"
          />

          {!isLogin && (
            <p className="text-xs text-red-400 mt-1">
              * Password must be at least 8 characters and include uppercase,
              lowercase, number, and special character.
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="w-full mt-4 py-3 rounded-lg
              bg-[#ff7400] text-black font-semibold
              hover:bg-[#ff8a1f] transition"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </motion.button>

          <p className="text-sm text-center mt-6 text-gray-400">
            {isLogin ? "New here?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setInfo("");
              }}
              className="ml-2 underline cursor-pointer text-white"
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </motion.form>

      </div>
    </div>

    {/* Input styles */}
    <style jsx>{`
      .auth-input {
        width: 100%;
        padding: 12px;
        margin-bottom: 12px;
        border-radius: 10px;
        background: #111;
        border: 1px solid #2a2a2a;
        color: #eaeaea;
      }
      .auth-input:focus {
        outline: none;
        border-color: #ff7400;
        box-shadow: 0 0 0 1px rgba(255,116,0,0.3);
      }
    `}</style>
  </div>
);
}
