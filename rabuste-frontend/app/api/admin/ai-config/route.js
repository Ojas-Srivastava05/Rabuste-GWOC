import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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
    const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

    const cookie = req.headers.get("cookie");
    const authorization = req.headers.get("authorization");
    
    let body;
    try {
      body = await req.json();
      console.log("Frontend API received body:", body);
    } catch (error) {
      console.error("Failed to parse request body:", error);
      body = {};
    }

    console.log("Forwarding PATCH request to backend:", {
      backendURL,
      hasCookie: !!cookie,
      hasAuth: !!authorization,
      body
    });

    const res = await axios.patch(
      `${backendURL}/api/admin/ai-config`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookie || "",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        withCredentials: true,
      }
    );

    console.log("Backend response:", {
      status: res.status,
      statusText: res.statusText,
      data: res.data
    });

    return NextResponse.json(res.data);
  } catch (error) {
    console.error("AI Config PATCH error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    return NextResponse.json(
      { 
        message: error.response?.data?.message || "Failed to update AI config",
        error: error.message 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// Back-compat if something still uses PUT
export async function PUT(req) {
  return PATCH(req);
}
