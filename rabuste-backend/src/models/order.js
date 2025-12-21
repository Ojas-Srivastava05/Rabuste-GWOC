import mongoose from "mongoose";

const orderSchema=new mongoose.Schema(
  {
    userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
    items:[
      {
        itemId:String,
        quantity:Number,
      },
    ],
    userLocation:{
      lat:Number,
      lng:Number,
    },
    price:{type:Number,required:true},
    assignedStoreId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Store",
    },
     pickupSlot: String,

    status: {
      type: String,
      enum: ["pending", "assigned", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
  
);

export default mongoose.model("Order",orderSchema);