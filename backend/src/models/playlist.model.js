import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		imageUrl: {
			type: String,
			default: "",
		},
		userId: {
			type: String,
			required: true,
		},
		songs: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song",
		}],
		isPublic: {
			type: Boolean,
			default: true,
		},
		isLikedSongs: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistSchema);