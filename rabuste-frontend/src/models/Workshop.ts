// import mongoose, { Schema, models } from "mongoose";

// const WorkshopSchema = new Schema(
//   {
//     title: String,
//     category: {
//       type: String,
//       enum: ["coffee", "painting"],
//     },
//     date: String, // YYYY-MM-DD
//     time: String,
//     description: String,
//     instructor: String,
//     location: String,
//     status: {
//       type: String,
//       enum: ["upcoming", "past"],
//       default: "upcoming",
//     },
//   },
//   { timestamps: true }
// );

// export const Workshop =
//   models.Workshop || mongoose.model("Workshop", WorkshopSchema);


// import mongoose, { Schema, models, model } from "mongoose";

// const WorkshopSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     category: { type: String, required: true },
//     date: { type: String, required: true },
//     time: String,
//     description: String,
//     instructor: String,
//     location: String,
//     status: { type: String, default: "upcoming" },
//   },
//   { timestamps: true }
// );

// export const Workshop =
//   models.Workshop || model("Workshop", WorkshopSchema);

import mongoose, { Schema } from "mongoose";

const WorkshopSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["coffee", "painting"],
      required: true,
    },
    date: { type: String, required: true },
    time: String,
    description: String,
    instructor: String,
    location: String,
    status: {
      type: String,
      enum: ["upcoming", "past"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Workshop ||
  mongoose.model("Workshop", WorkshopSchema);
