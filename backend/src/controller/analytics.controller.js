import { Song } from "../models/song.model.js";
import { PlayHistory } from "../models/playHistory.model.js";
import { User } from "../models/user.model.js";

export const trackPlay = async (req, res) => {
	try {
		const { songId, duration } = req.body;
		const userId = req.auth.userId;

		// Create play history record
		await PlayHistory.create({
			userId,
			songId,
			duration,
		});

		// Update song play counts
		const song = await Song.findById(songId);
		if (song) {
			song.playCount += 1;
			
			// Update weekly/monthly plays based on date
			const now = new Date();
			const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			
			const weeklyPlays = await PlayHistory.countDocuments({
				songId,
				playedAt: { $gte: weekAgo }
			});
			
			const monthlyPlays = await PlayHistory.countDocuments({
				songId,
				playedAt: { $gte: monthAgo }
			});
			
			song.weeklyPlays = weeklyPlays;
			song.monthlyPlays = monthlyPlays;
			song.lastPlayedAt = now;
			
			await song.save();
		}

		res.json({ message: "Play tracked successfully" });
	} catch (error) {
		console.log("Error in trackPlay", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getArtistStats = async (req, res) => {
	try {
		const userId = req.auth.userId;
		const user = await User.findOne({ clerkId: userId });
		
		if (!user || !user.isArtist) {
			return res.status(403).json({ message: "Artist access only" });
		}

		// Get artist's songs with real play data
		const songs = await Song.find({ artist: user.artistName });
		
		// Get daily stats for last 7 days
		const dailyStats = [];
		for (let i = 6; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			date.setHours(0, 0, 0, 0);
			
			const nextDate = new Date(date);
			nextDate.setDate(nextDate.getDate() + 1);
			
			const dayPlays = await PlayHistory.countDocuments({
				songId: { $in: songs.map(s => s._id) },
				playedAt: { $gte: date, $lt: nextDate }
			});
			
			dailyStats.push({
				date: date.toISOString().split('T')[0],
				listens: dayPlays
			});
		}

		res.json({ songs, dailyStats });
	} catch (error) {
		console.log("Error in getArtistStats", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const getAdminStats = async (req, res) => {
	try {
		// Get all songs with play counts
		const songs = await Song.find().sort({ playCount: -1 });
		
		// Get artist stats
		const artistStats = await Song.aggregate([
			{
				$group: {
					_id: "$artist",
					totalListens: { $sum: "$playCount" },
					songCount: { $sum: 1 }
				}
			},
			{ $sort: { totalListens: -1 } },
			{ $limit: 10 }
		]);

		// Get monthly trends
		const monthlyTrends = [];
		for (let i = 5; i >= 0; i--) {
			const date = new Date();
			date.setMonth(date.getMonth() - i);
			date.setDate(1);
			date.setHours(0, 0, 0, 0);
			
			const nextMonth = new Date(date);
			nextMonth.setMonth(nextMonth.getMonth() + 1);
			
			const monthPlays = await PlayHistory.countDocuments({
				playedAt: { $gte: date, $lt: nextMonth }
			});
			
			monthlyTrends.push({
				month: date.toLocaleDateString('en', { month: 'short' }),
				listens: monthPlays
			});
		}

		res.json({ 
			songs: songs.slice(0, 10), 
			artistStats: artistStats.map(stat => ({
				name: stat._id,
				totalListens: stat.totalListens,
				songCount: stat.songCount
			})),
			monthlyTrends
		});
	} catch (error) {
		console.log("Error in getAdminStats", error);
		res.status(500).json({ message: "Internal server error" });
	}
};