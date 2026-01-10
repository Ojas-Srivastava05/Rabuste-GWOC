import mongoose, { Schema, models, model } from "mongoose";

const InstagramPostSchema = new Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    
    imageUrl: {
      type: String,
      required: true,
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
    
    isManual: {
      type: Boolean,
      default: false,
    },
    
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in Next.js hot reload
const InstagramPost = models.InstagramPost || model("InstagramPost", InstagramPostSchema);

export default InstagramPost;
