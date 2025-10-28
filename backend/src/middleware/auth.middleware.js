import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const userEmail = currentUser.primaryEmailAddress?.emailAddress;
		const adminEmail = process.env.ADMIN_EMAIL;
		// Only admin email gets admin access
		const isAdmin = adminEmail === userEmail;

		console.log('Admin check:', { userEmail, adminEmail, isAdmin });

		if (!isAdmin) {
			return res.status(403).json({ message: `Unauthorized - Admin access required` });
		}

		next();
	} catch (error) {
		next(error);
	}
};

export const requireArtist = async (req, res, next) => {
	try {
		const { User } = await import("../models/user.model.js");
		const user = await User.findOne({ clerkId: req.auth.userId });
		
		if (!user || !user.isArtist) {
			return res.status(403).json({ message: "Unauthorized - you must be an artist" });
		}
		
		req.user = user;
		next();
	} catch (error) {
		next(error);
	}
};
