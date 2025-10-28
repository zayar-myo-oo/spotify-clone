import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		clerkId: {
			type: String,
			required: true,
			unique: true,
		},
		likedSongs: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song",
		}],
		followedArtists: [{
			type: String, // Artist names
		}],
		likedAlbums: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
		}],
		playlists: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Playlist",
		}],
		isArtist: {
			type: Boolean,
			default: false,
		},
		artistName: String,
		artistBio: String,
		artistProfileImage: String,
		genre: String,
		followers: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		}],
	},
	{ timestamps: true } //  createdAt, updatedAt
);

export const User = mongoose.model("User", userSchema);
