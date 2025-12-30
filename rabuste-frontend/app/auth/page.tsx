"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import PhoneInput from "@/components/PhoneInput";
import { Coffee, Zap, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const isStrongPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useUser();
  
  const verified = params.get("verified");
  const redirect = params.get("redirect");

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "",
    phoneCountryCode: "+91",
    phoneNumber: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhoneError("");
    setInfo("");
    setLoading(true);

    if (!isLogin) {
      if (!isStrongPassword(form.password)) {
        setError("Use 8+ chars with upper, lower, number & symbol");
        setLoading(false);
        return;
      }

      if (!form.phoneNumber) {
        setPhoneError("Phone number is required");
        setLoading(false);
        return;
      }
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
        // 1. Store JWT and set user in context
        // Check if this is a direct login (no redirect param means path 1)
        const isDirectLogin = !redirect;
        login(data.token, data.user, isDirectLogin);
      
        // 2. Attach cart to user
        await fetch("/api/cart/attach", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
      
        // 3. Redirect user
        router.push(redirect || "/");
      } else {
        setInfo("Check your email to verify your account");
        setForm({ 
          name: "", 
          email: "", 
          password: "",
          phoneCountryCode: "+91",
          phoneNumber: ""
        });
      }
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      // Check if error is phone-related
      if (errorMessage.toLowerCase().includes("phone")) {
        setPhoneError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden" style={{ background: '#000000' }}>
        {/* Background Pattern */}
        <DynamicBackground />

        {/* Main Layout */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 w-full max-w-6xl">

            {/* LEFT: Brand Panel */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden lg:flex flex-col justify-center"
            >
              <h1 
                className="text-6xl mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                <span style={{ color: '#FFFEF9' }}>RABUSTE</span>
                <br />
                <span className="gradient-copper">COFFEE</span>
              </h1>

              <p className="text-xl mb-12" style={{ color: '#B87333', lineHeight: 1.6 }}>
                2X the caffeine. Twice the power.
                <br />
                <span style={{ color: '#8B6F47', fontSize: '1rem' }}>
                  Join the unapologetically bold coffee movement.
                </span>
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Zap size={24} />, text: 'Maximum Caffeine Content' },
                  { icon: <Coffee size={24} />, text: '100% Premium Robusta' },
                  { icon: <Shield size={24} />, text: 'Exclusive Member Benefits' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(184, 115, 51, 0.2), rgba(115, 54, 53, 0.2))',
                        border: '2px solid rgba(184, 115, 51, 0.3)',
                        color: '#B87333',
                      }}
                    >
                      {item.icon}
                    </div>
                    <span 
                      className="text-base"
                      style={{ 
                        color: '#FFFEF9',
                        fontFamily: 'var(--font-heading)',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT: Auth Card */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-md mx-auto brutal-card p-10"
            >
              {/* Brand */}
              <div className="text-center mb-8">
                <h1 
                  className="text-4xl mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  RABUSTE
                </h1>
                <div 
                  className="w-16 h-px mx-auto mb-3"
                  style={{ background: 'linear-gradient(90deg, transparent, #B87333, transparent)' }}
                />
                <p 
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: '#8B6F47' }}
                >
                  BOLD • INTENSE • POWERFUL
                </p>
              </div>

              {/* Title */}
              <h2 
                className="text-2xl text-center mb-6"
                style={{
                  fontFamily: 'var(--font-heading)',
                  color: '#FFFEF9',
                  fontWeight: 400,
                  letterSpacing: '0.08em',
                }}
              >
                {isLogin ? "WELCOME BACK" : "JOIN THE MOVEMENT"}
              </h2>

              {verified && (
                <div className="mb-4 p-3 bg-green-950/30 border-2 border-green-700/50 text-green-300 text-sm text-center">
                  ✓ Email verified. Please login.
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-950/30 border-2 border-red-700/50 text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              {info && (
                <div className="mb-4 p-3 bg-amber-950/30 border-2 border-amber-700/50 text-amber-300 text-sm">
                  {info}
                </div>
              )}

              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="FULL NAME"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input"
                />
              )}

              <input
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                value={form.email}
                onChange={handleChange}
                className="auth-input"
              />

              {!isLogin && (
                <div className="mb-4">
                  <PhoneInput
                    value={form.phoneNumber}
                    countryCode={form.phoneCountryCode}
                    onCountryChange={(code) => setForm({ ...form, phoneCountryCode: code })}
                    onNumberChange={(number) => setForm({ ...form, phoneNumber: number })}
                    error={phoneError}
                  />
                </div>
              )}

              <input
                name="password"
                type="password"
                placeholder="PASSWORD"
                required
                value={form.password}
                onChange={handleChange}
                className="auth-input"
              />

              {!isLogin && (
                <p className="text-xs mb-4" style={{ color: '#8B6F47' }}>
                  * Min 8 chars: uppercase, lowercase, number & special character
                </p>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="w-full mt-6 py-4 transition-all duration-300"
                style={{
                  background: loading 
                    ? 'linear-gradient(135deg, #4A4A4A, #5A5A5A)' 
                    : 'linear-gradient(135deg, #B87333, #CD7F32)',
                  color: '#000000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                  fontSize: '14px',
                  border: '2px solid rgba(184, 115, 51, 0.4)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "SIGN UP"}
              </motion.button>

              <p className="text-sm text-center mt-8" style={{ color: '#8B6F47' }}>
                {isLogin ? "New to Rabuste?" : "Already have an account?"}
                <span
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setPhoneError("");
                    setInfo("");
                  }}
                  className="ml-2 cursor-pointer transition-colors"
                  style={{ 
                    color: '#B87333',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {isLogin ? "SIGN UP" : "LOGIN"}
                </span>
              </p>
            </motion.form>

          </div>
        </div>

        {/* Input styles */}
        <style jsx>{`
          .auth-input {
            width: 100%;
            padding: 16px;
            margin-bottom: 16px;
            background: rgba(20, 20, 20, 0.8);
            border: 2px solid rgba(184, 115, 51, 0.2);
            color: #FFFEF9;
            font-family: 'Work Sans', sans-serif;
            font-size: 14px;
            letter-spacing: 0.05em;
            text-transform: none;
            transition: all 0.3s;
          }
          .auth-input::placeholder {
            color: #8B6F47;
            letter-spacing: 0.1em;
            text-transform: none;
          }
          .auth-input:focus {
            outline: none;
            border-color: #B87333;
            background: rgba(20, 20, 20, 0.9);
            box-shadow: 0 0 0 1px rgba(184, 115, 51, 0.3);
          }
        `}</style>
      </div>
    </>
  );
}