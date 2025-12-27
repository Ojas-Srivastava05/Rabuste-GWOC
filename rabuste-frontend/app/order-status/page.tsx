"use client";

import { useEffect, useState } from "react";

export default function OrderStatusPage() {
  // 15 minutes = 900 seconds
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#0A0A0A",
        color: "#fff",
      }}
    >
      {timeLeft > 0 ? (
        <>
          <h1>Your order is being prepared ☕</h1>
          <p style={{ marginTop: 16 }}>
            Time remaining: <strong>{formatTime(timeLeft)}</strong>
          </p>
        </>
      ) : (
        <>
          <h1>✅ Order Ready!</h1>
          <p>Please collect your order.</p>
        </>
      )}
    </div>
  );
}
