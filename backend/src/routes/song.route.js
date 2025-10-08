import { Router } from "express";
import { getAllSongs, getFeaturedSongs, getMadeForYouSongs, getTrendingSongs, searchSongs, getSongById } from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/:id", getSongById);

export default router;
