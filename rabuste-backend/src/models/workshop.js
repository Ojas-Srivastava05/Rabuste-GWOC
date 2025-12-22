import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
  {
    title: String,
    instructor: String,
    date: Date,
    category:{
      type:String,
       enum:["painting","coffee"],

    },
   
    description:String,
    image:String,
    timeSlots: [String],
    capacity: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", workshopSchema);
