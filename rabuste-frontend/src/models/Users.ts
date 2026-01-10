// import mongoose, { Schema, models, model } from "mongoose";

// const UserSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       select: false, // NEVER expose password
//     },
//     role: {
//       type: String,
//       enum: ["admin", "user"],
//       default: "user",
//     },
//     isBlocked: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// // Prevent model overwrite in Next.js hot reload
// const User = models.User || model("User", UserSchema);

// export default User;
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: {
    countryCode: String,
    number: String,
    fullNumber: { type: String, unique: true }
  },
  role: { type: String, default: "user" },
  isVerified: { type: Boolean, default: false },

  // OTP verification
  verificationCode: String,
  verificationCodeExpiry: Date,
  resetPasswordCode: String,
  resetPasswordExpiry: Date,
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
