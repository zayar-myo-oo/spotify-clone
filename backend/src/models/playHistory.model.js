import mongoose from "mongoose";

const playHistorySchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		songId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song",
			required: true,
		},
		playedAt: {
			type: Date,
			default: Date.now,
		},
		duration: {
			type: Number, // seconds played
			default: 0,
		},
	},
	{ timestamps: true }
);

export const PlayHistory = mongoose.model("PlayHistory", playHistorySchema);