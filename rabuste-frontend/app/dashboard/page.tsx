"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // 1️⃣ Get token from browser
    const token = localStorage.getItem("token");

    // 2️⃣ If token does NOT exist → user is not logged in
    if (!token) {
      router.push("/auth");
      return;
    }

    // 3️⃣ Call protected backend route WITH token
    fetch("http://127.0.0.1:5000/api/protected/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`, // 🔑 THIS IS IMPORTANT
      },
    })
      .then((res) => {
        // 4️⃣ If backend rejects token
        if (!res.ok) {
          throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        // 5️⃣ Backend accepted token → user is valid
        console.log("Protected data:", data);
      })
      .catch(() => {
        // 6️⃣ Token invalid / expired → logout user
        localStorage.removeItem("token");
        router.push("/auth");
      });
  }, [router]);

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">Welcome to Dashboard 🎉</h1>
    </div>
  );
}
