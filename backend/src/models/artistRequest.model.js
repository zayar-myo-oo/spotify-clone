import mongoose from "mongoose";

const artistRequestSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		artistName: {
			type: String,
			required: true,
		},
		originalName: {
			type: String,
			required: true,
		},
		sampleSongUrl: {
			type: String,
			required: true,
		},
		profilePhotoUrl: {
			type: String,
			required: true,
		},
		socialMediaAccounts: {
			facebook: String,
			instagram: String,
			twitter: String,
			youtube: String,
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		adminNotes: String,
	},
	{ timestamps: true }
);

export const ArtistRequest = mongoose.model("ArtistRequest", artistRequestSchema);