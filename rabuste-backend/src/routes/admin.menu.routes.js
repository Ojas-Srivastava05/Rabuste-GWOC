import express from "express";
import {
  addMenuItem,
  getAllMenuItems,
} from "../controllers/menu.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/menu",
  authMiddleware,
  adminMiddleware,
  addMenuItem
);

router.get(
  "/menu",
  authMiddleware,
  adminMiddleware,
  getAllMenuItems
);

export default router;
