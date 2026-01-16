import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    // 🔥 ADD THIS
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order token for daily serial tracking (001, 002, 003... resets daily)
    token: {
      type: String,
      required: true,
      index: true,
    },

    // snapshot info (fine to keep)
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    items: [
      {
        menuItem: {
          type: Schema.Types.ObjectId,
          ref: "Menu",
        },
        artItem: {
          type: Schema.Types.ObjectId,
          ref: "Art",
        },
        itemType: {
          type: String,
          enum: ["menu", "art"],
        },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: { type: Number, required: true },

    couponCode: {
      type: String,
      default: null,
      required: false,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      required: false,
    },

    couponDescription: {
      type: String,
      default: null,
      required: false,
    },

    instructions: {
      type: String,
      default: "",
    },

    // Time estimation fields
    estimatedTimeToCafe: {
      type: Number, // in minutes
      default: null,
    },
    preparationTime: {
      type: Number, // in minutes, admin configurable
      default: null,
    },
    distanceFromCafe: {
      type: Number, // in km
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default models.Order || mongoose.model("Order", OrderSchema);
