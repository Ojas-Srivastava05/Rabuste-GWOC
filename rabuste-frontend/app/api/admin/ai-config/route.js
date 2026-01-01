import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const backendURL =
      process.env.BACKEND_URL || "http://localhost:5001";

    const cookie = req.headers.get("cookie");
    const authorization = req.headers.get("authorization");

    const res = await axios.get(
      `${backendURL}/api/admin/ai-config`,
      {
        headers: {
          Cookie: cookie || "",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch AI config" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    const backendURL =
      process.env.BACKEND_URL || "http://localhost:5001";

    const cookie = req.headers.get("cookie");
    const authorization = req.headers.get("authorization");
    const body = await req.json();

    const res = await axios.patch(
      `${backendURL}/api/admin/ai-config`,
      body,
      {
        headers: {
          Cookie: cookie || "",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        withCredentials: true,
      }
    );

    return NextResponse.json(res.data);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update AI config" },
      { status: 500 }
    );
  }
}

// Back-compat if something still uses PUT
export async function PUT(req) {
  return PATCH(req);
}
