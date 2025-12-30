import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Middleware to verify JWT token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.isAdmin = decoded.isAdmin;
    
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Verify token and return user data
router.get("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -verificationToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: req.userRole,
        isAdmin: req.isAdmin,
      },
    });
  } catch (error) {
    console.error("Verify endpoint error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// Example protected route
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({
      message: "Protected data",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: req.userRole,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

export default router;