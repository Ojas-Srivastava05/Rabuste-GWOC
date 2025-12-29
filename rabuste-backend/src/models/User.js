import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: {
    countryCode: { 
      type: String, 
      required: true 
    },
    number: { 
      type: String, 
      required: true 
    },
    fullNumber: { 
      type: String, 
      required: true,
      unique: true 
    }
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  location: { 
    lat: Number, 
    lng: Number 
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);