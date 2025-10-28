import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		artist: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		audioUrl: {
			type: String,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
		albumId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Album",
			required: false,
		},
		playCount: {
			type: Number,
			default: 0,
		},
		weeklyPlays: {
			type: Number,
			default: 0,
		},
		monthlyPlays: {
			type: Number,
			default: 0,
		},
		lastPlayedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true }
);

export const Song = mongoose.model("Song", songSchema);
