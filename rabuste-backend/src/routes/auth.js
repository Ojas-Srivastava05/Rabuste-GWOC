import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import sendVerificationEmail from "../utils/sendEmail.js";

const router = express.Router();

/* PASSWORD VALIDATION */
const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  return regex.test(password);
};

/* PHONE NUMBER VALIDATION */
const phoneValidationRules = {
  '+1': { length: 10, name: 'United States/Canada' },
  '+44': { length: 10, name: 'United Kingdom' },
  '+91': { length: 10, name: 'India' },
  '+61': { length: 9, name: 'Australia' },
  '+81': { length: 10, name: 'Japan' },
  '+86': { length: 11, name: 'China' },
  '+33': { length: 9, name: 'France' },
  '+49': { length: 10, name: 'Germany' },
  '+39': { length: 10, name: 'Italy' },
  '+34': { length: 9, name: 'Spain' },
  '+55': { length: 11, name: 'Brazil' },
  '+52': { length: 10, name: 'Mexico' },
  '+971': { length: 9, name: 'UAE' },
  '+966': { length: 9, name: 'Saudi Arabia' },
  '+65': { length: 8, name: 'Singapore' },
  '+60': { length: 9, name: 'Malaysia' },
  '+62': { length: 10, name: 'Indonesia' },
  '+63': { length: 10, name: 'Philippines' },
  '+66': { length: 9, name: 'Thailand' },
  '+84': { length: 9, name: 'Vietnam' },
  '+82': { length: 10, name: 'South Korea' },
  '+92': { length: 10, name: 'Pakistan' },
  '+880': { length: 10, name: 'Bangladesh' },
  '+94': { length: 9, name: 'Sri Lanka' },
  '+977': { length: 10, name: 'Nepal' },
};

const validatePhoneNumber = (countryCode, number) => {
  const rule = phoneValidationRules[countryCode];
  if (!rule) {
    return { valid: false, message: 'Invalid country code' };
  }
  
  // Remove any spaces, dashes, or special characters
  const cleanNumber = number.replace(/[\s\-\(\)]/g, '');
  
  // Check if number contains only digits
  if (!/^\d+$/.test(cleanNumber)) {
    return { valid: false, message: 'Phone number must contain only digits' };
  }
  
  // Check length
  if (cleanNumber.length !== rule.length) {
    return { 
      valid: false, 
      message: `Phone number for ${rule.name} must be ${rule.length} digits` 
    };
  }
  
  return { valid: true, cleanNumber };
};

/* SIGNUP (USER ONLY) */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phoneCountryCode, phoneNumber } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phoneCountryCode || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneCountryCode, phoneNumber);
    if (!phoneValidation.valid) {
      return res.status(400).json({ message: phoneValidation.message });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if phone number already exists
    const fullPhoneNumber = `${phoneCountryCode}${phoneValidation.cleanNumber}`;
    const existingPhone = await User.findOne({ 'phone.fullNumber': fullPhoneNumber });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
      phone: {
        countryCode: phoneCountryCode,
        number: phoneValidation.cleanNumber,
        fullNumber: fullPhoneNumber,
      },
      role: "user",
      isVerified: false,
      verificationToken,
    });

    console.log("📧 Sending verification email to:", email);
    await sendVerificationEmail(email, verificationToken);
    console.log("✅ Verification email sent");

    res.status(201).json({
      message: "Signup successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

/* EMAIL VERIFICATION */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("❌ Email verification error:", error);
    res.status(500).json({ message: "Email verification failed" });
  }
});

/* LOGIN (ADMIN + USER) */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Normalize admin detection
    const isAdmin =
      (user.role && user.role.toLowerCase() === "admin") ||
      user.isAdmin === true;

    // Enforce email verification ONLY for normal users
    if (!isAdmin && !user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: isAdmin ? "admin" : "user",
        isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: isAdmin ? "admin" : "user",
        isAdmin,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;