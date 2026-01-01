import mongoose, { Schema, models, model } from "mongoose";

const ArtSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr: string[]) {
          return arr && arr.length > 0;
        },
        message: 'At least one image is required'
      }
    },

    category: {
      type: String,
      enum: ["painting", "sculpture", "photography", "digital", "mixed-media", "print"],
      required: true,
    },

    medium: {
      type: String,
      trim: true,
    },

    dimensions: {
      type: String,
      trim: true,
    },

    year: {
      type: Number,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Art = models.Art || model("Art", ArtSchema);

export default Art;