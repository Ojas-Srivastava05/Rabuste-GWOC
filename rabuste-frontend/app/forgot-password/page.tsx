"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const submit = async () => {
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg("If the email exists, a reset code has been sent");
    router.push(
      `/reset-password?email=${encodeURIComponent(email)}`
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <DynamicBackground />
        <div className="brutal-card p-10 max-w-md w-full" >
          <h2 className="text-white text-2xl mb-4 text-center">
            Forgot Password
          </h2>

          {msg && (
            <p className="text-green-300 text-sm mb-4 text-center">{msg}</p>
          )}

          <input
            className="auth-input mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={submit}
            className="w-full py-3 bg-[#B87333] text-black font-bold"
          >
            Send Reset Code
          </button>
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
