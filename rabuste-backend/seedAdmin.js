import mongoose from "mongoose";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({ email: "srivastavaojas454@gmail.com" });
    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Ojas2005@", 10);

    await User.create({
      name: "Admin",
      email: "srivastavaojas454@gmail.com",
      password: hashedPassword,
      role: "admin",
      isAdmin: true,
      isVerified: true,
    });

    console.log("Admin user created successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
