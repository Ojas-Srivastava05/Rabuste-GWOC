"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Squares from "@/components/Squares";

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
      ? "http://127.0.0.1:5000/api/auth/login"
      : "http://127.0.0.1:5000/api/auth/signup";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin
          ? { email: form.email, password: form.password }
          : form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (isLogin) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
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
    <div className="relative min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center overflow-hidden">

      {/* 🔳 Background grid */}
      <div className="absolute inset-0 opacity-30">
        <Squares squareSize={60} speed={0.25} />
      </div>

      {/* 🔐 Auth Card */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md
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

        {/* <AnimatePresence mode="wait"> */}
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
        {/* </AnimatePresence> */}

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
            * Password must be at least 8 characters and include uppercase, lowercase,
            number, and special character.
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

      <style jsx>{`
        .auth-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 10px;
          background: #111;
          border: 1px solid #2a2a2a;
          color: #eaeaea;
          transition: border 0.2s, box-shadow 0.2s;
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
