import mongoose, { Schema, models, model } from "mongoose";

const CartItemSchema = new Schema(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
      required: function(this: any) {
        return this.itemType === "menu";
      },
    },

    artItem: {
      type: Schema.Types.ObjectId,
      ref: "Art",
      required: function(this: any) {
        return this.itemType === "art";
      },
    },

    itemType: {
      type: String,
      enum: ["menu", "art"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
    },
  },
  { _id: false }
);

const CartSchema = new Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    items: [CartItemSchema],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = models.Cart || model("Cart", CartSchema);

export default Cart;
