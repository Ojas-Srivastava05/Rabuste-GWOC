import { NextResponse } from "next/server";
import { connectDB } from "@/src/lib/db";
import InstagramPost from "@/src/models/InstagramPost";

// Get all Instagram posts (admin)
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const posts = await InstagramPost.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching Instagram posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts" },
      { status: 500 }
    );
  }
}

// Add or manage Instagram posts
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { action, embedUrl, caption, likes } = body;

    if (action !== "manual") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Validate embedUrl
    if (!embedUrl || typeof embedUrl !== 'string') {
      return NextResponse.json(
        { error: "Valid embed URL is required" },
        { status: 400 }
      );
    }

    // Extract Instagram post ID from URL
    let instagramId = '';
    let permalink = embedUrl;

    // Match patterns like:
    // https://www.instagram.com/p/ABC123/
    // https://instagram.com/p/ABC123/
    // https://www.instagram.com/reel/ABC123/
    const match = embedUrl.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/);
    
    if (match && match[2]) {
      instagramId = match[2];
      permalink = `https://www.instagram.com/${match[1]}/${instagramId}/`;
    } else {
      return NextResponse.json(
        { error: "Invalid Instagram URL format. Use format: https://www.instagram.com/p/POST_ID/" },
        { status: 400 }
      );
    }

    // Check if post already exists
    const existingPost = await InstagramPost.findOne({ instagramId });
    if (existingPost) {
      return NextResponse.json(
        { error: "This Instagram post has already been added" },
        { status: 400 }
      );
    }

    // Create new Instagram post
    const newPost = await InstagramPost.create({
      instagramId,
      embedUrl: permalink,
      imageUrl: `https://www.instagram.com/p/${instagramId}/media/?size=l`, // Instagram embed image
      caption: caption || '',
      permalink,
      likes: likes || 0,
      mediaType: 'IMAGE',
      isManual: true,
      timestamp: new Date(),
    });

    return NextResponse.json(
      { 
        message: "Post added successfully",
        post: newPost 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error in Instagram admin action:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}

// Update Instagram post
export async function PATCH(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const { postId, updates } = body;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const updatedPost = await InstagramPost.findByIdAndUpdate(
      postId,
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
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// Delete Instagram post
export async function DELETE(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const deletedPost = await InstagramPost.findByIdAndDelete(postId);

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
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
