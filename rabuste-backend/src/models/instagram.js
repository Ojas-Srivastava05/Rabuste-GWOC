import mongoose from "mongoose";

const instagramPostSchema = new mongoose.Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    
    permalink: {
      type: String,
      required: true,
      trim: true,
    },
    
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    timestamp: {
      type: Date,
      required: true,
    },
    
    mediaType: {
      type: String,
      enum: ["IMAGE", "VIDEO", "CAROUSEL_ALBUM"],
      default: "IMAGE",
    },
    
    // For manual posts (when API is not configured)
    isManual: {
      type: Boolean,
      default: false,
    },
    
    // Order for manual posts
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient querying by timestamp and manual posts
instagramPostSchema.index({ timestamp: -1 });
instagramPostSchema.index({ isManual: 1, displayOrder: 1 });

export default mongoose.models.InstagramPost || mongoose.model("InstagramPost", instagramPostSchema);
