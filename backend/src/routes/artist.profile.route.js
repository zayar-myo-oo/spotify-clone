import { Router } from "express";
import { getArtistProfile, followArtist } from "../controller/artist.profile.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:artistName", getArtistProfile);
router.post("/:artistName/follow", protectRoute, followArtist);

export default router;