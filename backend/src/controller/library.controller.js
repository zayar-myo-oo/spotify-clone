import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { Playlist } from "../models/playlist.model.js";

export const toggleLikeSong = async (req, res) => {
	try {
		const { songId } = req.params;
		const userId = req.auth.userId;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isLiked = user.likedSongs.includes(songId);
		
		if (isLiked) {
			user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
		} else {
			user.likedSongs.push(songId);
		}

		await user.save();

		// Also add/remove from "Liked Songs" playlist
		let likedSongsPlaylist = await Playlist.findOne({ 
			userId: userId, 
			isLikedSongs: true 
		});

		if (!likedSongsPlaylist) {
			// Create "Liked Songs" playlist if it doesn't exist
			likedSongsPlaylist = new Playlist({
				name: "Liked Songs",
				userId: userId,
				isLikedSongs: true,
				isPublic: false,
			});
			await likedSongsPlaylist.save();
			
			// Add to user's playlists
			user.playlists.push(likedSongsPlaylist._id);
			await user.save();
		}

		if (isLiked) {
			likedSongsPlaylist.songs = likedSongsPlaylist.songs.filter(id => id.toString() !== songId);
		} else {
			likedSongsPlaylist.songs.push(songId);
		}

		await likedSongsPlaylist.save();

		res.json({ 
			isLiked: !isLiked,
			message: isLiked ? "Song removed from liked songs" : "Song added to liked songs"
		});
	} catch (error) {
		console.log("Error in toggleLikeSong controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const toggleLikeAlbum = async (req, res) => {
	try {
		const { albumId } = req.params;
		const userId = req.auth.userId;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isLiked = user.likedAlbums.includes(albumId);
		
		if (isLiked) {
			user.likedAlbums = user.likedAlbums.filter(id => id.toString() !== albumId);
		} else {
			user.likedAlbums.push(albumId);
		}

		await user.save();

		res.json({ 
			isLiked: !isLiked,
			message: isLiked ? "Album removed from library" : "Album added to library"
		});
	} catch (error) {
		console.log("Error in toggleLikeAlbum controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const toggleFollowArtist = async (req, res) => {
	try {
		const { artistName } = req.params;
		const userId = req.auth.userId;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isFollowing = user.followedArtists.includes(artistName);
		
		if (isFollowing) {
			user.followedArtists = user.followedArtists.filter(artist => artist !== artistName);
		} else {
			user.followedArtists.push(artistName);
		}

		await user.save();

		res.json({ 
			isFollowing: !isFollowing,
			message: isFollowing ? `Unfollowed ${artistName}` : `Following ${artistName}`
		});
	} catch (error) {
		console.log("Error in toggleFollowArtist controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getUserLibrary = async (req, res) => {
	try {
		const userId = req.auth.userId;

		const user = await User.findOne({ clerkId: userId })
			.populate({
				path: "likedSongs",
				select: "title artist imageUrl duration"
			})
			.populate({
				path: "likedAlbums",
				select: "title artist imageUrl releaseYear"
			})
			.populate({
				path: "playlists",
				populate: {
					path: "songs",
					select: "title artist imageUrl duration"
				}
			});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			likedSongs: user.likedSongs || [],
			likedAlbums: user.likedAlbums || [],
			followedArtists: user.followedArtists || [],
			playlists: user.playlists || [],
		});
	} catch (error) {
		console.log("Error in getUserLibrary controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const checkIsLiked = async (req, res) => {
	try {
		const { type, id } = req.params; // type: 'song' | 'album' | 'artist'
		const userId = req.auth.userId;

		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		let isLiked = false;

		switch (type) {
			case 'song':
				isLiked = user.likedSongs.includes(id);
				break;
			case 'album':
				isLiked = user.likedAlbums.includes(id);
				break;
			case 'artist':
				isLiked = user.followedArtists.includes(id);
				break;
			default:
				return res.status(400).json({ message: "Invalid type" });
		}

		res.json({ isLiked });
	} catch (error) {
		console.log("Error in checkIsLiked controller", error.message);
		res.status(500).json({ message: "Internal server error" });
	}
};