import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";

export const createPlaylist = async (req, res) => {
	try {
		const { name, description, isPublic = true } = req.body;
		const userId = req.auth.userId;

		const playlist = new Playlist({
			name,
			description,
			userId,
			isPublic,
		});

		await playlist.save();

		// Add playlist to user's playlists
		await User.findOneAndUpdate(
			{ clerkId: userId },
			{ $push: { playlists: playlist._id } }
		);

		res.status(201).json(playlist);
	} catch (error) {
		console.log("Error in createPlaylist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserPlaylists = async (req, res) => {
	try {
		const userId = req.auth.userId;
		
		const user = await User.findOne({ clerkId: userId }).populate({
			path: "playlists",
			populate: {
				path: "songs",
				select: "title artist imageUrl duration"
			}
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user.playlists || []);
	} catch (error) {
		console.log("Error in getUserPlaylists controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getPlaylistById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.auth.userId;

		const playlist = await Playlist.findById(id).populate("songs");

		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		// Check if user has access to this playlist
		if (!playlist.isPublic && playlist.userId !== userId) {
			return res.status(403).json({ message: "Access denied" });
		}

		res.json(playlist);
	} catch (error) {
		console.log("Error in getPlaylistById controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const addSongToPlaylist = async (req, res) => {
	try {
		const { playlistId } = req.params;
		const { songId } = req.body;
		const userId = req.auth.userId;

		const playlist = await Playlist.findById(playlistId);
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		if (playlist.userId !== userId) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (playlist.songs.includes(songId)) {
			return res.status(400).json({ message: "Song already in playlist" });
		}

		playlist.songs.push(songId);
		await playlist.save();

		res.json({ message: "Song added to playlist successfully" });
	} catch (error) {
		console.log("Error in addSongToPlaylist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const removeSongFromPlaylist = async (req, res) => {
	try {
		const { playlistId, songId } = req.params;
		const userId = req.auth.userId;

		const playlist = await Playlist.findById(playlistId);
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		if (playlist.userId !== userId) {
			return res.status(403).json({ message: "Access denied" });
		}

		playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
		await playlist.save();

		res.json({ message: "Song removed from playlist successfully" });
	} catch (error) {
		console.log("Error in removeSongFromPlaylist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deletePlaylist = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.auth.userId;

		const playlist = await Playlist.findById(id);
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		if (playlist.userId !== userId) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (playlist.isLikedSongs) {
			return res.status(400).json({ message: "Cannot delete liked songs playlist" });
		}

		await Playlist.findByIdAndDelete(id);

		// Remove playlist from user's playlists
		await User.findOneAndUpdate(
			{ clerkId: userId },
			{ $pull: { playlists: id } }
		);

		res.json({ message: "Playlist deleted successfully" });
	} catch (error) {
		console.log("Error in deletePlaylist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const updatePlaylist = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, description, isPublic } = req.body;
		const userId = req.auth.userId;

		const playlist = await Playlist.findById(id);
		
		if (!playlist) {
			return res.status(404).json({ message: "Playlist not found" });
		}

		if (playlist.userId !== userId) {
			return res.status(403).json({ message: "Access denied" });
		}

		if (playlist.isLikedSongs && name !== playlist.name) {
			return res.status(400).json({ message: "Cannot rename liked songs playlist" });
		}

		playlist.name = name || playlist.name;
		playlist.description = description !== undefined ? description : playlist.description;
		playlist.isPublic = isPublic !== undefined ? isPublic : playlist.isPublic;

		await playlist.save();

		res.json(playlist);
	} catch (error) {
		console.log("Error in updatePlaylist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};