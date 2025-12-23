// import mongoose, { Schema, models } from "mongoose";

// const OrderSchema = new Schema(
//   {
//     customerName: {
//       type: String,
//       required: true,
//     },

//     customerEmail: {
//       type: String,
//       required: true,
//     },

//     items: [
//       {
//         name: String,
//         price: Number,
//         quantity: Number,
//       },
//     ],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "completed"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// export default models.Order || mongoose.model("Order", OrderSchema);


import mongoose, { Schema, models } from "mongoose";

const OrderSchema = new Schema(
  {
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },

    items: [
      {
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: { type: Number, required: true },

    instructions: {
      type: String,
      default: "",
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
