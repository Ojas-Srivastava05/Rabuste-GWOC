import express from "express";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
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

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/protected/verify - Verify token and return user data
router.get("/verify", async (req, res) => {
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
        isVerified: user.isVerified || false,
      },
    });
  } catch (error) {
    console.error("Verify endpoint error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

// GET /api/protected/profile - Get user profile
router.get("/profile", async (req, res) => {
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
        phone: user.phone || null,
        role: req.userRole,
        isAdmin: req.isAdmin,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// PUT /api/protected/profile - Update user profile
router.put("/profile", async (req, res) => {
  try {
    const { name, phoneCountryCode, phoneNumber, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name is required" });
    }

    // Fetch user from database
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate and update phone number
    if (phoneNumber) {
      // Remove any spaces or special characters from phone number
      const cleanedPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      
      if (cleanedPhoneNumber.length < 10) {
        return res.status(400).json({ message: "Phone number must be at least 10 digits" });
      }

      const fullPhoneNumber = `${phoneCountryCode || "+91"}${cleanedPhoneNumber}`;

      // Check if phone number is already taken by another user
      const existingPhone = await User.findOne({
        "phone.fullNumber": fullPhoneNumber,
        _id: { $ne: req.userId },
      });

      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already in use by another account" });
      }

      // Update phone
      user.phone = {
        countryCode: phoneCountryCode || "+91",
        number: cleanedPhoneNumber,
        fullNumber: fullPhoneNumber,
      };
    }

    // Update name
    user.name = name.trim();

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Validate new password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({ 
          message: "New password must be at least 8 characters with uppercase, lowercase, number and special character" 
        });
      }

      // Don't allow same password
      const isSamePassword = await bcryptjs.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password must be different from current password" });
      }

      // Hash and update password
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(newPassword, salt);
    } else if (currentPassword || newPassword) {
      // If only one password field is provided
      return res.status(400).json({ message: "Both current and new password are required to change password" });
    }

    // Save updated user
    await user.save();

    // Return updated user data (without password)
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        role: req.userRole,
        isAdmin: req.isAdmin,
      },
    });

  } catch (error) {
    console.error("Profile update error:", error);
    
    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error: " + error.message });
    }
    
    res.status(500).json({ message: "Failed to update profile. Please try again." });
  }
});

// POST /api/protected/change-password - Change password only
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters with uppercase, lowercase, number and special character" 
      });
    }

    // Don't allow same password
    const isSamePassword = await bcryptjs.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    // Hash and update password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// DELETE /api/protected/account - Delete user account
router.delete("/account", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required to delete account" });
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify password before deletion
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Delete user
    await User.findByIdAndDelete(req.userId);

    res.status(200).json({ message: "Account deleted successfully" });

  } catch (error) {
    console.error("Account deletion error:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

// GET /api/protected/me - Alternative endpoint for getting current user
router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -verificationToken");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      role: req.userRole,
      isAdmin: req.isAdmin,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// GET /api/protected/dashboard - Dashboard data (kept from original)
router.get("/dashboard", async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json({
      message: "Protected data",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: req.userRole,
        isAdmin: req.isAdmin,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

export default router;