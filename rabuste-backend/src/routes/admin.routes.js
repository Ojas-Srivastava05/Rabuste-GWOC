import express from "express";
import * as menu from "../controllers/menu.controller.js";
import * as art from "../controllers/art.controller.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import { getAdminDashboard } from "../controllers/admin.controller.js";
const router = express.Router();

// Menu routes
router.post("/menu", auth, admin, menu.addMenuItem);
router.get("/menu", auth, admin, menu.getAllMenuItems);
router.get("/menu/:id", auth, admin, menu.getMenuItemById);
router.put("/menu/:id", auth, admin, menu.updateMenuItem);
router.delete("/menu/:id", auth, admin, menu.deleteMenuItem);

// Art/Gallery routes
router.post("/art", auth, admin, art.addArtItem);
router.get("/art", auth, admin, art.getAllArtItems);
router.get("/art/:id", auth, admin, art.getArtItemById);
router.put("/art/:id", auth, admin, art.updateArtItem);
router.delete("/art/:id", auth, admin, art.deleteArtItem);

router.get("/dashboard",auth,admin,getAdminDashboard);
import {
  getAIConfig,
  updateAIConfig,
  getDiscountSuggestions,
} from "../controllers/admin.controller.js";

router.get("/ai-config",auth,admin,getAIConfig);
router.patch("/ai-config",auth,admin,updateAIConfig);

router.get("/discount-suggestions", auth, admin, getDiscountSuggestions);



//router.get("/orders",auth,admin,getAllOrders);
// router.patch( "/orders/:id/slot",auth,admin,assignPickupSlot);
    

  

export default router;
