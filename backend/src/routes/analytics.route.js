import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { trackPlay, getArtistStats, getAdminStats } from "../controller/analytics.controller.js";

const router = Router();

router.post("/track-play", protectRoute, trackPlay);
router.get("/artist-stats", protectRoute, getArtistStats);
router.get("/admin-stats", protectRoute, getAdminStats);

export default router;