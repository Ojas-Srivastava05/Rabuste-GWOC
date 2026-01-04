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
   
    description: String,
    image: String,
    timeSlots: [String],
    capacity: { type: Number, default: 0 },
    registrations: [
      {
        name: String,
        email: String,
        registeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Workshop", workshopSchema);
