"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    token ? "verifying" : "error"
  );

  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setStatus("success");
        setTimeout(() => {
          router.push("/auth?verified=true");
        }, 2500);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
      <div className="bg-black/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center max-w-md">
        {status === "verifying" && (
          <p className="text-lg font-semibold animate-pulse">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-400">
              Email Verified 🎉
            </h1>
            <p className="mt-3 text-gray-300">
              Your account is ready. Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-400">
              Verification Failed ❌
            </h1>
            <p className="mt-3 text-gray-400">
              Invalid or expired verification link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="bg-black/70 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center max-w-md">
          <p className="text-lg font-semibold animate-pulse">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
