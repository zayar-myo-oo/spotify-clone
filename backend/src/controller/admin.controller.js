import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import { parseFile } from "music-metadata";

// helper function for cloudinary uploads
const uploadToCloudinary = async (file) => {
	try {
		const result = await cloudinary.uploader.upload(file.tempFilePath, {
			resource_type: "auto",
		});
		return result.secure_url;
	} catch (error) {
		console.log("Error in uploadToCloudinary", error);
		throw new Error("Error uploading to cloudinary");
	}
};

export const createSong = async (req, res, next) => {
	try {
		if (!req.files || !req.files.audioFile || !req.files.imageFile) {
			return res.status(400).json({ message: "Please upload all files" });
		}

		const { title, artist, albumId } = req.body;
		const audioFile = req.files.audioFile;
		const imageFile = req.files.imageFile;

		// Extract duration from audio file
		const metadata = await parseFile(audioFile.tempFilePath);
		const duration = Math.round(metadata.format.duration || 0);

		const audioUrl = await uploadToCloudinary(audioFile);
		const imageUrl = await uploadToCloudinary(imageFile);

		const song = new Song({
			title,
			artist,
			audioUrl,
			imageUrl,
			duration,
			albumId: albumId || null,
		});

		await song.save();

		// if song belongs to an album, update the album's songs array
		if (albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}
		res.status(201).json(song);
	} catch (error) {
		console.log("Error in createSong", error);
		next(error);
	}
};

export const updateSong = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, artist, albumId } = req.body;
		let duration = song.duration; // Keep existing duration by default

		const song = await Song.findById(id);
		if (!song) {
			return res.status(404).json({ message: "Song not found" });
		}

		const oldAlbumId = song.albumId;

		// Handle file uploads if provided
		let audioUrl = song.audioUrl;
		let imageUrl = song.imageUrl;

		if (req.files?.audioFile) {
			// Extract duration from new audio file
			const metadata = await parseFile(req.files.audioFile.tempFilePath);
			duration = Math.round(metadata.format.duration || 0);
			audioUrl = await uploadToCloudinary(req.files.audioFile);
		}
		if (req.files?.imageFile) {
			imageUrl = await uploadToCloudinary(req.files.imageFile);
		}

		// Update song
		const updatedSong = await Song.findByIdAndUpdate(
			id,
			{
				title,
				artist,
				audioUrl,
				imageUrl,
				duration,
				albumId: albumId || null,
			},
			{ new: true }
		);

		// Handle album changes
		if (oldAlbumId && oldAlbumId.toString() !== albumId) {
			await Album.findByIdAndUpdate(oldAlbumId, {
				$pull: { songs: song._id },
			});
		}
		if (albumId && oldAlbumId?.toString() !== albumId) {
			await Album.findByIdAndUpdate(albumId, {
				$push: { songs: song._id },
			});
		}

		res.status(200).json(updatedSong);
	} catch (error) {
		console.log("Error in updateSong", error);
		next(error);
	}
};

export const deleteSong = async (req, res, next) => {
	try {
		const { id } = req.params;

		const song = await Song.findById(id);

		// if song belongs to an album, update the album's songs array
		if (song.albumId) {
			await Album.findByIdAndUpdate(song.albumId, {
				$pull: { songs: song._id },
			});
		}

		await Song.findByIdAndDelete(id);

		res.status(200).json({ message: "Song deleted successfully" });
	} catch (error) {
		console.log("Error in deleteSong", error);
		next(error);
	}
};

export const createAlbum = async (req, res, next) => {
	try {
		const { title, artist, releaseYear } = req.body;
		const { imageFile } = req.files;

		const imageUrl = await uploadToCloudinary(imageFile);

		const album = new Album({
			title,
			artist,
			imageUrl,
			releaseYear,
		});

		await album.save();

		res.status(201).json(album);
	} catch (error) {
		console.log("Error in createAlbum", error);
		next(error);
	}
};

export const deleteAlbum = async (req, res, next) => {
	try {
		const { id } = req.params;
		await Song.deleteMany({ albumId: id });
		await Album.findByIdAndDelete(id);
		res.status(200).json({ message: "Album deleted successfully" });
	} catch (error) {
		console.log("Error in deleteAlbum", error);
		next(error);
	}
};

export const checkAdmin = async (req, res, next) => {
	res.status(200).json({ admin: true });
};
