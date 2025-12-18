import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Example protected route
router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Protected dashboard data",
    user: req.user,
  });
});

export default router;
