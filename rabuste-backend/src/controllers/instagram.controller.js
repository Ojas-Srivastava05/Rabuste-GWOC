import InstagramPost from "../models/instagram.js";

// Note: For auto-fetching Instagram posts, you'll need to set up Instagram Basic Display API:
// 1. Create a Facebook App at https://developers.facebook.com/
// 2. Add Instagram Basic Display product
// 3. Get User Access Token (long-lived token recommended)
// 4. Use POST /api/instagram/admin/fetch with { accessToken, userId }
// Or manually add posts using POST /api/instagram/admin/manual

// Get latest 6 Instagram posts
export const getInstagramPosts = async (req, res) => {
  try {
    // Get latest 6 posts, prioritizing non-manual posts first
    const posts = await InstagramPost.find()
      .sort({ 
        isManual: 1, // Manual posts last
        timestamp: -1 // Then by timestamp
      })
      .limit(6)
      .lean();
    
    res.json(posts);
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    res.status(500).json({ message: "Failed to fetch Instagram posts" });
  }
};

// Auto-fetch Instagram posts from API (uses Instagram Graph API)
// Note: Requires Instagram Business or Creator account connected to a Facebook Page
export const fetchInstagramPosts = async (req, res) => {
  try {
    const { accessToken, userId } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({ 
        message: "Instagram access token is required" 
      });
    }

    // If userId is provided, use it; otherwise use 'me' to fetch current user's posts
    const endpoint = userId 
      ? `https://graph.instagram.com/${userId}/media`
      : `https://graph.instagram.com/me/media`;

    // Fetch posts from Instagram Graph API
    const response = await fetch(
      `${endpoint}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count&access_token=${accessToken}&limit=6`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from Instagram API");
    }

    const data = await response.json();
    const posts = data.data || [];

    // Process and save posts to database
    const savedPosts = [];
    for (const post of posts) {
      try {
        const postData = {
          instagramId: post.id,
          imageUrl: post.media_url || post.thumbnail_url || "",
          caption: post.caption?.substring(0, 500) || "", // Limit caption length
          permalink: post.permalink || "",
          likes: post.like_count || 0,
          timestamp: new Date(post.timestamp),
          mediaType: post.media_type || "IMAGE",
          isManual: false,
        };

        // Upsert: Update if exists, create if not
        const savedPost = await InstagramPost.findOneAndUpdate(
          { instagramId: post.id },
          postData,
          { upsert: true, new: true }
        );
        savedPosts.push(savedPost);
      } catch (postError) {
        console.error(`Error processing post ${post.id}:`, postError);
      }
    }

    res.json({ 
      message: "Instagram posts fetched successfully",
      count: savedPosts.length,
      posts: savedPosts
    });
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    res.status(500).json({ 
      message: "Failed to fetch Instagram posts",
      error: error.message 
    });
  }
};

// Manually add Instagram post (for admin - simple link + caption)
export const addInstagramPost = async (req, res) => {
  try {
    const { embedUrl, caption, permalink, likes = 0 } = req.body;

    // Extract permalink from embedUrl (Instagram post URL)
    let finalPermalink = permalink;
    
    if (embedUrl && embedUrl.trim()) {
      // Extract post ID from Instagram URL (e.g., https://www.instagram.com/p/ABC123/)
      const urlMatch = embedUrl.trim().match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
      if (urlMatch) {
        const postId = urlMatch[1];
        finalPermalink = `https://www.instagram.com/p/${postId}/`;
      } else if (!finalPermalink) {
        // If embedUrl doesn't match pattern but is provided, use it as permalink
        finalPermalink = embedUrl.trim();
      }
    }

    if (!finalPermalink) {
      return res.status(400).json({ 
        message: "Instagram post URL is required. Please provide a valid Instagram post URL (e.g., https://www.instagram.com/p/ABC123/)" 
      });
    }

    // Use permalink as imageUrl placeholder (we'll display it as a clickable card)
    const finalImageUrl = finalPermalink;

    // Generate a unique ID for manual posts
    const instagramId = `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const post = await InstagramPost.create({
      instagramId,
      imageUrl: finalImageUrl,
      caption: caption || "",
      permalink: finalPermalink,
      likes: likes || 0,
      timestamp: new Date(),
      mediaType: "IMAGE",
      isManual: true,
      displayOrder: await InstagramPost.countDocuments({ isManual: true }),
    });

    res.status(201).json(post);
  } catch (error) {
    console.error("Error adding Instagram post:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "This Instagram post already exists" });
    }
    res.status(500).json({ message: "Failed to add Instagram post", error: error.message });
  }
};

// Get all Instagram posts (admin)
export const getAllInstagramPosts = async (req, res) => {
  try {
    const posts = await InstagramPost.find()
      .sort({ timestamp: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching all Instagram posts:", error);
    res.status(500).json({ message: "Failed to fetch Instagram posts" });
  }
};

// Update Instagram post (admin)
export const updateInstagramPost = async (req, res) => {
  try {
    const updated = await InstagramPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json(updated);
  } catch (error) {
    console.error("Error updating Instagram post:", error);
    res.status(500).json({ message: "Failed to update Instagram post" });
  }
};

// Delete Instagram post (admin)
export const deleteInstagramPost = async (req, res) => {
  try {
    const deleted = await InstagramPost.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting Instagram post:", error);
    res.status(500).json({ message: "Failed to delete Instagram post" });
  }
};
