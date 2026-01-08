"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      router.push("/auth?verified=true");
    } catch (err: any) {
      setError(err.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md brutal-card p-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1
          className="text-3xl mb-3"
          style={{
            fontFamily: "var(--font-heading)",
            color: "#FFFEF9",
            letterSpacing: "0.08em",
          }}
        >
          VERIFY EMAIL
        </h1>

        <div
          className="w-20 h-px mx-auto mb-4"
          style={{
            background:
              "linear-gradient(90deg, transparent, #B87333, transparent)",
          }}
        />

        <p className="text-sm leading-relaxed" style={{ color: "#8B6F47" }}>
          Enter the 6-digit code sent to
          <br />
          <span style={{ color: "#B87333", wordBreak: "break-all" }}>
            {email}
          </span>
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-3 bg-red-950/30 border-2 border-red-700/50 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* OTP Input */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="••••••"
        className="w-full text-center tracking-[0.6em] text-xl mb-6 auth-input"
      />

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full py-4 transition-all duration-300"
        style={{
          background: loading
            ? "linear-gradient(135deg, #4A4A4A, #5A5A5A)"
            : "linear-gradient(135deg, #B87333, #CD7F32)",
          color: "#000000",
          fontFamily: "var(--font-heading)",
          letterSpacing: "0.15em",
          fontSize: "14px",
          border: "2px solid rgba(184, 115, 51, 0.4)",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "VERIFYING..." : "VERIFY"}
      </button>

      {/* Footer */}
      <p
        className="text-xs text-center mt-8"
        style={{ color: "#8B6F47" }}
      >
        Didn't receive the code?
        <br />
        Check spam or try again in a minute.
      </p>

      {/* Shared input style (same as auth page) */}
      <style jsx>{`
        .auth-input {
          padding: 16px;
          background: rgba(20, 20, 20, 0.8);
          border: 2px solid rgba(184, 115, 51, 0.2);
          color: #fffef9;
          font-family: "Work Sans", sans-serif;
          letter-spacing: 0.4em;
          transition: all 0.3s;
        }
        .auth-input::placeholder {
          color: #8b6f47;
          letter-spacing: 0.4em;
        }
        .auth-input:focus {
          outline: none;
          border-color: #b87333;
          background: rgba(20, 20, 20, 0.9);
          box-shadow: 0 0 0 1px rgba(184, 115, 51, 0.3);
        }
      `}</style>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-black">
        <DynamicBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
          <Suspense 
            fallback={
              <div className="w-full max-w-md brutal-card p-10">
                <div className="text-center" style={{ color: "#B87333" }}>
                  Loading...
                </div>
              </div>
            }
          >
            <VerifyForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
