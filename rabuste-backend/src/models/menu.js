import mongoose from "mongoose";

const menuSchema=new mongoose.Schema({
  name:{type:String,required:true},
  price:{type:Number,required:true},
  category:String,
  image:String,
  isAvailable:{type:Boolean,default:true},
},
{timestamps:true}
);

export default mongoose.model("Menu",menuSchema);
