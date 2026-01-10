import express from "express";
import {
  getInstagramPosts,
  addInstagramPost,
  getAllInstagramPosts,
  updateInstagramPost,
  deleteInstagramPost,
} from "../controllers/instagram.controller.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route: Get latest 6 Instagram posts
router.get("/", getInstagramPosts);

// Admin routes: Manage Instagram posts
router.get("/admin/all", authMiddleware, adminMiddleware, getAllInstagramPosts);
router.post("/admin/manual", authMiddleware, adminMiddleware, addInstagramPost); // Manually add post
router.patch("/admin/:id", authMiddleware, adminMiddleware, updateInstagramPost);
router.delete("/admin/:id", authMiddleware, adminMiddleware, deleteInstagramPost);

export default router;
