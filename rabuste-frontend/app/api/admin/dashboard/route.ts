import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const backendURL =
      process.env.BACKEND_URL || "http://localhost:5001";

    // Forward cookies for auth
    const cookie = req.headers.get("cookie");

    const res = await axios.get(
      `${backendURL}/api/admin/dashboard`,
      {
        headers: {
          Cookie: cookie || "",
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch admin dashboard" },
      { status: 500 }
    );
  }
}
