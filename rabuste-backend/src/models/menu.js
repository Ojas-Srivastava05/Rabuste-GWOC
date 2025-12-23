import mongoose from "mongoose";

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String, // URL (Cloudinary / S3 later)
      required: true,
    },

    brewTime: {
      type: Number, // minutes
      required: true,
      min: 1,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    category: {
      type: String,
      enum: ["coffee", "beverage", "snack", "dessert"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Menu", menuSchema);
