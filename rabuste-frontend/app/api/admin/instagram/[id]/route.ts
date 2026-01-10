import { NextResponse } from "next/server";

const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

// Update Instagram post (admin)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const res = await fetch(`${backendURL}/api/instagram/admin/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error: error.message || "Failed to update post" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error updating Instagram post:", error);
    return NextResponse.json(
      { error: "Failed to update Instagram post" },
      { status: 500 }
    );
  }
}

// Delete Instagram post (admin)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${backendURL}/api/instagram/admin/${params.id}`, {
      method: "DELETE",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json({ error: error.message || "Failed to delete post" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting Instagram post:", error);
    return NextResponse.json(
      { error: "Failed to delete Instagram post" },
      { status: 500 }
    );
  }
}
