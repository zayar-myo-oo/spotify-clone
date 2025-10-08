import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	createPlaylist,
	getUserPlaylists,
	getPlaylistById,
	addSongToPlaylist,
	removeSongFromPlaylist,
	deletePlaylist,
	updatePlaylist,
} from "../controller/playlist.controller.js";

const router = Router();

// All routes require authentication
router.use(protectRoute);

router.post("/", createPlaylist);
router.get("/", getUserPlaylists);
router.get("/:id", getPlaylistById);
router.put("/:id", updatePlaylist);
router.delete("/:id", deletePlaylist);
router.post("/:playlistId/songs", addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", removeSongFromPlaylist);

export default router;