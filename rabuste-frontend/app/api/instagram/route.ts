import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import InstagramPost from "@/src/models/InstagramPost";

// Get latest 6 Instagram posts (public route)
export async function GET() {
  try {
    await connectDB();

    // Get latest 6 posts, prioritizing non-manual posts first
    const posts = await InstagramPost.find()
      .sort({ 
        isManual: 1, // Manual posts last
        timestamp: -1 // Then by timestamp
      })
      .limit(6)
      .lean();

    // Return empty array if no posts found (don't throw error)
    return NextResponse.json(posts || [], { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Instagram posts:", error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json([], { status: 200 });
  }
}
