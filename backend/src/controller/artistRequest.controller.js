import { ArtistRequest } from "../models/artistRequest.model.js";
import { User } from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

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

export const createArtistRequest = async (req, res, next) => {
	try {
		const { artistName, originalName, socialMediaAccounts } = req.body;
		const clerkUserId = req.auth.userId;

		if (!req.files || !req.files.sampleSong || !req.files.profilePhoto) {
			return res.status(400).json({ message: "Sample song and profile photo are required" });
		}

		// Find the actual user document
		const user = await User.findOne({ clerkId: clerkUserId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		const userId = user._id;

		// Check if user already has pending request
		const existingRequest = await ArtistRequest.findOne({ 
			userId, 
			status: "pending" 
		});
		
		if (existingRequest) {
			return res.status(400).json({ message: "You already have a pending request" });
		}

		const sampleSongUrl = await uploadToCloudinary(req.files.sampleSong);
		const profilePhotoUrl = await uploadToCloudinary(req.files.profilePhoto);

		let parsedSocialMedia = {};
		try {
			parsedSocialMedia = JSON.parse(socialMediaAccounts || "{}");
		} catch (parseError) {
			console.log("Error parsing social media accounts:", parseError);
			parsedSocialMedia = {};
		}

		const artistRequest = new ArtistRequest({
			userId,
			artistName,
			originalName,
			sampleSongUrl,
			profilePhotoUrl,
			socialMediaAccounts: parsedSocialMedia,
		});

		await artistRequest.save();
		res.status(201).json({ message: "Artist request submitted successfully" });
	} catch (error) {
		console.log("Error in createArtistRequest:", error);
		next(error);
	}
};

export const getAllArtistRequests = async (req, res, next) => {
	try {
		const requests = await ArtistRequest.find().populate("userId", "fullName imageUrl").sort({ createdAt: -1 });
		res.status(200).json(requests);
	} catch (error) {
		next(error);
	}
};

export const approveArtistRequest = async (req, res, next) => {
	try {
		const { requestId } = req.params;
		const { adminNotes } = req.body;

		const request = await ArtistRequest.findById(requestId);
		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		// Update user to artist
		await User.findByIdAndUpdate(request.userId, {
			isArtist: true,
			artistName: request.artistName,
		});

		// Update request status
		request.status = "approved";
		request.adminNotes = adminNotes;
		await request.save();

		res.status(200).json({ message: "Artist request approved" });
	} catch (error) {
		next(error);
	}
};

export const rejectArtistRequest = async (req, res, next) => {
	try {
		const { requestId } = req.params;
		const { adminNotes } = req.body;

		const request = await ArtistRequest.findByIdAndUpdate(
			requestId,
			{ status: "rejected", adminNotes },
			{ new: true }
		);

		if (!request) {
			return res.status(404).json({ message: "Request not found" });
		}

		res.status(200).json({ message: "Artist request rejected" });
	} catch (error) {
		next(error);
	}
};