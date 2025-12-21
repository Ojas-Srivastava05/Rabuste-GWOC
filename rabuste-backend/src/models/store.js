import mongoose from 'mongoose';

const storeSchema=new mongoose.Schema({
  name:{type:String,required:true},
  lat:{type:Number,required:true},
  lng:{type:Number,required:true},
  workingHours:{
    open:String,
    close:String,
  },
});

export default mongoose.model("Store",storeSchema);
