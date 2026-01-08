"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";

export default function ResetPasswordPage() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!code || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword: password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      setLoading(false);
      return;
    }

    router.push("/auth");
  };

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black">
        <DynamicBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
          <div
            className="brutal-card p-10 max-w-md w-full"
            style={{
              border: "2px solid rgba(184, 115, 51, 0.3)",
              background: "rgba(0,0,0,0.85)",
            }}
          >
            <h2
              className="text-2xl text-center mb-6"
              style={{
                fontFamily: "var(--font-heading)",
                color: "#FFFEF9",
                letterSpacing: "0.08em",
              }}
            >
              RESET PASSWORD
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-950/30 border-2 border-red-700/50 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* OTP */}
            <input
            className="auth-input mb-4 text-center tracking-widest"
            placeholder="RESET CODE"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />


            {/* PASSWORD WITH EYE */}
            <div className="relative mb-6">
            <input
                type={showPassword ? "text" : "password"}
                className="auth-input pr-12"
                placeholder="NEW PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{
                  color: showPassword ? "#B87333" : "#8B6F47",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 transition-all duration-300"
              style={{
                background: loading
                  ? "linear-gradient(135deg, #4A4A4A, #5A5A5A)"
                  : "linear-gradient(135deg, #B87333, #CD7F32)",
                color: "#000000",
                fontFamily: "var(--font-heading)",
                letterSpacing: "0.15em",
                border: "2px solid rgba(184, 115, 51, 0.4)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .auth-input {
            width: 100%;
            padding: 16px;
            background: rgba(20, 20, 20, 0.8);
            border: 2px solid rgba(184, 115, 51, 0.2);
            color: #FFFEF9;
            font-family: 'Work Sans', sans-serif;
            font-size: 14px;
            letter-spacing: 0.05em;
            transition: all 0.3s;
        }

        .auth-input::placeholder {
            color: #8B6F47;
            letter-spacing: 0.1em;
        }

        .auth-input:focus {
            outline: none;
            border-color: #B87333;
            background: rgba(20, 20, 20, 0.9);
            box-shadow: 0 0 0 1px rgba(184, 115, 51, 0.3);
        }
        `}</style>

    </>
  );
}
