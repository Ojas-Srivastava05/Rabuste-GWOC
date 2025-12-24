import express from "express";
import * as art from "../controllers/artwork.controller.js";
import auth from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/artworks", auth, admin, art.addArtwork);
router.get("/artworks", auth, admin, art.getAllArtworks);
router.get("/artworks/:id", auth, admin, art.getArtworkById);
router.put("/artworks/:id", auth, admin, art.updateArtwork);
router.delete("/artworks/:id", auth, admin, art.deleteArtwork);

export default router;
