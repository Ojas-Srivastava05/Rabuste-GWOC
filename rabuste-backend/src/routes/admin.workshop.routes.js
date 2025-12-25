import express from "express";
import * as ws from "../controllers/workshop.controller.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/workshops", auth, admin, ws.addWorkshop);
router.get("/workshops", auth, admin, ws.getAllWorkshops);
router.get("/workshops/:id", auth, admin, ws.getWorkshopById);
router.put("/workshops/:id", auth, admin, ws.updateWorkshop);
router.delete("/workshops/:id", auth, admin, ws.deleteWorkshop);

export default router;
