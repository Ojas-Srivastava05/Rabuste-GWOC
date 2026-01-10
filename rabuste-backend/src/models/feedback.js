import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["order", "cafe", "website"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    userEmail: {
      type: String,
      default: "",
    },
    userName: {
      type: String,
      default: "Guest",
    },
    
    // Order specific fields
    orderId: {
      type: String,
      default: "",
    },
    
    // Ratings (0-5)
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    
    // Order specific ratings
    foodQuality: { type: Number, min: 0, max: 5, default: 0 },
    deliveryTime: { type: Number, min: 0, max: 5, default: 0 },
    packaging: { type: Number, min: 0, max: 5, default: 0 },
    
    // Cafe specific ratings
    ambience: { type: Number, min: 0, max: 5, default: 0 },
    service: { type: Number, min: 0, max: 5, default: 0 },
    cleanliness: { type: Number, min: 0, max: 5, default: 0 },
    music: { type: Number, min: 0, max: 5, default: 0 },
    
    // Website specific ratings
    easeOfUse: { type: Number, min: 0, max: 5, default: 0 },
    design: { type: Number, min: 0, max: 5, default: 0 },
    speed: { type: Number, min: 0, max: 5, default: 0 },
    features: { type: Number, min: 0, max: 5, default: 0 },
    
    // Comments
    comments: {
      type: String,
      default: "",
    },
    
    // AI Analysis
    sentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    sentimentScore: {
      type: Number,
      default: 0, // -1 to 1 scale
    },
    summary: {
      type: String,
      default: "",
    },
    categories: [{
      type: String, // e.g., "food_quality", "delivery", "service", etc.
    }],
    isFlagged: {
      type: Boolean,
      default: false, // Flag negative reviews for follow-up
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "low",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
