import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import InstagramPost from "@/src/models/InstagramPost";

// Update Instagram post (admin)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const body = await req.json();
    const { updates } = body;

    const updatedPost = await InstagramPost.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Post updated successfully",
        post: updatedPost 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating Instagram post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update Instagram post" },
      { status: 500 }
    );
  }
}

// Delete Instagram post (admin)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const deletedPost = await InstagramPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting Instagram post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete Instagram post" },
      { status: 500 }
    );
  }
}
