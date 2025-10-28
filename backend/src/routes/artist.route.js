import { Router } from "express";
import { createSong, createAlbum, getArtistAlbums, getArtistSongs, getArtistFollowers, updateSong, deleteSong } from "../controller/artist.controller.js";
import { protectRoute, requireArtist } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireArtist);

router.get("/albums", getArtistAlbums);
router.get("/songs", getArtistSongs);
router.get("/followers", getArtistFollowers);
router.post("/songs", createSong);
router.put("/songs/:id", updateSong);
router.delete("/songs/:id", deleteSong);
router.post("/albums", createAlbum);

export default router;