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
    capacity: { type: Number, default: 0 },
    registrations: [
      {
        name: String,
        email: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
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
