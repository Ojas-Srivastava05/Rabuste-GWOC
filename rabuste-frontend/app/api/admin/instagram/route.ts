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
    const { action, imageUrl, permalink, caption, likes } = body;

    if (action !== "manual") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Validate imageUrl (can be Cloudinary URL, regular URL, or base64 data URL)
    if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate permalink (Instagram URL)
    if (!permalink || typeof permalink !== 'string' || !permalink.trim()) {
      return NextResponse.json(
        { error: "Instagram post URL is required" },
        { status: 400 }
      );
    }

    // Validate image URL format (accepts Cloudinary, regular URLs, or base64 data URLs)
    const trimmedImageUrl = imageUrl.trim();
    const isBase64 = trimmedImageUrl.startsWith('data:image/');
    const isHttpUrl = trimmedImageUrl.match(/^https?:\/\/.+/);
    const isCloudinary = trimmedImageUrl.includes('cloudinary.com');
    
    if (!isBase64 && !isHttpUrl && !isCloudinary) {
      return NextResponse.json(
        { error: "Please provide a valid image URL or upload an image" },
        { status: 400 }
      );
    }

    // Validate Instagram URL format
    if (!permalink.includes('instagram.com')) {
      return NextResponse.json(
        { error: "Please provide a valid Instagram post URL" },
        { status: 400 }
      );
    }

    // Extract Instagram post ID from URL for uniqueness check
    let instagramId = '';
    let normalizedPermalink = permalink.trim();

    // Match patterns like:
    // https://www.instagram.com/p/ABC123/
    // https://instagram.com/p/ABC123/
    // https://www.instagram.com/reel/ABC123/
    const match = normalizedPermalink.match(/instagram\.com\/(p|reel)\/([A-Za-z0-9_-]+)/);
    
    if (match && match[2]) {
      instagramId = match[2];
      // Normalize permalink
      normalizedPermalink = `https://www.instagram.com/${match[1]}/${instagramId}/`;
    } else {
      // If we can't extract ID, use a hash of the URL as instagramId
      instagramId = `manual_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }

    // Check if post already exists (by permalink or instagramId)
    const existingPost = await InstagramPost.findOne({ 
      $or: [
        { instagramId },
        { permalink: normalizedPermalink }
      ]
    });
    
    if (existingPost) {
      return NextResponse.json(
        { error: "This Instagram post has already been added" },
        { status: 400 }
      );
    }

    // Create new Instagram post
    const newPost = await InstagramPost.create({
      instagramId,
      imageUrl: imageUrl.trim(), // Cloudinary image URL
      caption: caption?.trim() || '',
      permalink: normalizedPermalink,
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
