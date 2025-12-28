// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI as string;

// if (!MONGODB_URI) {
//   throw new Error("❌ MONGODB_URI not defined in .env.local");
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = {
//     conn: null,
//     promise: null,
//   };
// }

// export default async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI, {
//       dbName: "rabuste", // ✅ FORCE the correct database
//       bufferCommands: false,
//     });
//   }

//   cached.conn = await cached.promise;
//   console.log("✅ MongoDB connected to rabuste");
//   return cached.conn;
// }
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
