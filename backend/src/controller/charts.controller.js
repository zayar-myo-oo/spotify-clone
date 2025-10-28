import { Song } from "../models/song.model.js";

export const incrementPlayCount = async (req, res, next) => {
	try {
		const { songId } = req.params;
		
		await Song.findByIdAndUpdate(songId, {
			$inc: { 
				playCount: 1,
				weeklyPlays: 1,
				monthlyPlays: 1
			},
			lastPlayedAt: new Date()
		});

		res.status(200).json({ message: "Play count updated" });
	} catch (error) {
		next(error);
	}
};

export const getTopSongs = async (req, res, next) => {
	try {
		const { period = 'weekly', limit = 10 } = req.query;
		
		let sortField = 'weeklyPlays';
		if (period === 'monthly') sortField = 'monthlyPlays';
		if (period === 'alltime') sortField = 'playCount';

		const topSongs = await Song.find()
			.sort({ [sortField]: -1 })
			.limit(parseInt(limit))
			.select('title artist imageUrl playCount weeklyPlays monthlyPlays');

		res.status(200).json(topSongs);
	} catch (error) {
		next(error);
	}
};

export const resetWeeklyPlays = async (req, res, next) => {
	try {
		await Song.updateMany({}, { weeklyPlays: 0 });
		res.status(200).json({ message: "Weekly plays reset" });
	} catch (error) {
		next(error);
	}
};

export const resetMonthlyPlays = async (req, res, next) => {
	try {
		await Song.updateMany({}, { monthlyPlays: 0 });
		res.status(200).json({ message: "Monthly plays reset" });
	} catch (error) {
		next(error);
	}
};