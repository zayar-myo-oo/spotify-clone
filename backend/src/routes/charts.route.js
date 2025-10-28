import { Router } from "express";
import { incrementPlayCount, getTopSongs, resetWeeklyPlays, resetMonthlyPlays } from "../controller/charts.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/play/:songId", protectRoute, incrementPlayCount);
router.get("/top", getTopSongs);
router.post("/reset/weekly", resetWeeklyPlays);
router.post("/reset/monthly", resetMonthlyPlays);

export default router;