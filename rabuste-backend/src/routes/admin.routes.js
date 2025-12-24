import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {getAllUsers} from "../controllers/admin.controller";

const router=express.Router();
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);

export default router;