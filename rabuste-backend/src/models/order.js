import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Order token for daily serial tracking
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: [
      {
        itemId: String,
        quantity: Number,
      },
    ],

    userLocation: {
      lat: Number,
      lng: Number,
    },

    price: { type: Number, required: true },
    totalAmount: { type: Number },

    instructions: String,
    couponCode: String,
    couponDiscount: Number,

    paymentId: String,
    paymentStatus: String,

    assignedStoreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },

    pickupSlot: String,

    // ⏱ Time estimation fields
    estimatedTimeToCafe: {
      type: Number,
      default: null,
    },
    preparationTime: {
      type: Number,
      default: null,
    },
    distanceFromCafe: {
      type: Number,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "completed"],
      default: "pending",
    },

    /* 
        PETPOOJA INTEGRATION
    */
    // petpoojaOrderId: {
    //   type: String,
    //   default: null,
    // },

    /* 
        EXTERNAL SYNC STATUS
    */
    // externalSync: {
    //   petpooja: { type: Boolean, default: false },
    //   reelo: { type: Boolean, default: false },
    // },

  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
