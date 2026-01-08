import express from "express";
import AIConfig from "../models/aiconfig.js";

const router = express.Router();

// Public endpoint to get AI discount configuration
router.get("/", async (req, res) => {
  try {
    let config = await AIConfig.findOne();
    if (!config) {
      config = await AIConfig.create({});
    }
    
    // Return only the public discount information
    res.json({
      enableDiscountAI: config.enableDiscountAI || false,
      discountItemId: config.discountItemId || null,
      discountPercent: config.discountPercent || 0,
    });
  } catch (err) {
    console.error("Failed to fetch AI discount config:", err);
    res.status(500).json({ 
      message: "Failed to fetch AI discount config",
      enableDiscountAI: false,
      discountItemId: null,
      discountPercent: 0,
    });
  }
});

export default router;