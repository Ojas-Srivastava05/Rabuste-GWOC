import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const backendURL = process.env.BACKEND_URL || "http://localhost:5001";

    const cookie = req.headers.get("cookie");
    const authorization = req.headers.get("authorization");

    const res = await axios.get(`${backendURL}/api/admin/discount-suggestions`, {
      headers: {
        Cookie: cookie || "",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      withCredentials: true,
    });

    return NextResponse.json(res.data);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch discount suggestions" },
      { status: 500 }
    );
  }
}
