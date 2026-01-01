import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const backendURL = process.env.BACKEND_URL || "http://localhost:5001";

    const cookie = req.headers.get("cookie");

    const res = await axios.get(`${backendURL}/api/admin/menu`, {
      headers: {
        Cookie: cookie || "",
      },
      withCredentials: true,
    });

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
