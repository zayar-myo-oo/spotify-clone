import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { parseFile } from "music-metadata";

const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		throw new Error("Error uploading to cloudinary");
	}
};

export const getArtistAlbums = async (req, res, next) => {
	try {
		const albums = await Album.find({ artist: req.user.artistName }).populate("songs");
		res.status(200).json(albums);
	} catch (error) {
		next(error);
	}
};

export const getArtistSongs = async (req, res, next) => {
	try {
		const songs = await Song.find({ artist: req.user.artistName });
		res.status(200).json(songs);
	} catch (error) {
		next(error);
	}
};

export const createSong = async (req, res, next) => {
	try {
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, albumId } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		// Extract duration from audio file
		const metadata = await parseFile(audioFile.tempFilePath);
		const duration = Math.round(metadata.format.duration || 0);

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist: req.user.artistName,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		
		res.status(201).json(song);
	} catch (error) {
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, releaseYear } = req.body;
		const { imageFile } = req.files;

		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artist: req.user.artistName,
			imageUrl,
			releaseYear,
		});

		await album.save();
		res.status(201).json(album);
	} catch (error) {
		next(error);
	}
};

export const updateSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, albumId } = req.body;

		const song = await Song.findById(id);
		if (!song || song.artist !== req.user.artistName) {
			return res.status(404).json({ message: "Song not found or unauthorized" });
		}

		let duration = song.duration;
		let audioUrl = song.audioUrl;
		let imageUrl = song.imageUrl;

		if (req.files?.audioFile) {
			const metadata = await parseFile(req.files.audioFile.tempFilePath);
			duration = Math.round(metadata.format.duration || 0);
			audioUrl = await uploadToCloudinary(req.files.audioFile);
		}
		if (req.files?.imageFile) {
			imageUrl = await uploadToCloudinary(req.files.imageFile);
		}

		const updatedSong = await Song.findByIdAndUpdate(
			id,
			{ title, audioUrl, imageUrl, duration, albumId: albumId || null },
			{ new: true }
		);

		res.status(200).json(updatedSong);
	} catch (error) {
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const song = await Song.findById(id);

		if (!song || song.artist !== req.user.artistName) {
			return res.status(404).json({ message: "Song not found or unauthorized" });
		}

		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);
		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export const getArtistFollowers = async (req, res, next) => {
	try {
		const clerkUserId = req.auth.userId;
		const user = await User.findOne({ clerkId: clerkUserId });
		
		if (!user || !user.isArtist) {
			return res.status(403).json({ message: "Artist access required" });
		}

		const artistWithFollowers = await User.findById(user._id)
			.populate('followers', 'fullName imageUrl clerkId')
			.select('followers');

		res.status(200).json(artistWithFollowers.followers);
	} catch (error) {
		next(error);
	}
};