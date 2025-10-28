import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	toggleLikeSong,
	toggleLikeAlbum,
	toggleFollowArtist,
	getUserLibrary,
	checkIsLiked,
} from "../controller/library.controller.js";

const router = Router();

// All routes require authentication
router.use(protectRoute);

router.get("/", getUserLibrary);
router.post("/songs/:songId", toggleLikeSong);
router.post("/albums/:albumId", toggleLikeAlbum);
router.post("/artists/:artistName", toggleFollowArtist);
router.get("/check/:type/:id", checkIsLiked);

export default router;