import mongoose from "mongoose";

const artSchema = new mongoose.Schema(
  {
    title: String,
    artist: String,
    description: String,
    images: [String],
    price: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Art", artSchema);
