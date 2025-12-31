import express from "express";
import * as menu from "../controllers/menu.controller.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import { getAdminDashboard } from "../controllers/admin.controller.js";
const router = express.Router();

router.post("/menu", auth, admin, menu.addMenuItem);
router.get("/menu", auth, admin, menu.getAllMenuItems);
router.get("/menu/:id", auth, admin, menu.getMenuItemById);
router.put("/menu/:id", auth, admin, menu.updateMenuItem);
router.delete("/menu/:id", auth, admin, menu.deleteMenuItem);
router.get("/dashboard",auth,admin,getAdminDashboard);
import {
  getAIConfig,
  updateAIConfig,
} from "../controllers/admin.controller.js";

router.get("/ai-config",auth,admin,getAIConfig);
router.patch("/ai-config",auth,admin,updateAIConfig);



//router.get("/orders",auth,admin,getAllOrders);
// router.patch( "/orders/:id/slot",auth,admin,assignPickupSlot);
    

  

export default router;
