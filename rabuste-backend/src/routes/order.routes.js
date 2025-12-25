import express from "express";
import { placeOrder } from "../controllers/order.controller.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, placeOrder);

export default router;
