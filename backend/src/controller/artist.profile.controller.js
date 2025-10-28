import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const getArtistProfile = async (req, res, next) => {
	try {
		const { artistName } = req.params;
		
		// Find artist by name
		const artist = await User.findOne({ 
			artistName: artistName,
			isArtist: true 
		}).populate('followers', 'fullName imageUrl');

		if (!artist) {
			return res.status(404).json({ message: "Artist not found" });
		}

		// Get artist's songs
		const songs = await Song.find({ artist: artistName });
		
		// Get artist's albums
		const albums = await Album.find({ artist: artistName }).populate('songs');

		// Get recommended songs (same genre, different artists)
		const recommendedSongs = await Song.find({ 
			artist: { $ne: artistName }
		}).limit(10);

		res.status(200).json({
			artist: {
				_id: artist._id,
				artistName: artist.artistName,
				fullName: artist.fullName,
				imageUrl: artist.imageUrl,
				artistProfileImage: artist.artistProfileImage || artist.imageUrl,
				artistBio: artist.artistBio,
				genre: artist.genre,
				followers: artist.followers,
				followerCount: artist.followers.length
			},
			songs,
			albums,
			recommendedSongs
		});
	} catch (error) {
		next(error);
	}
};

export const followArtist = async (req, res, next) => {
	try {
		const { artistName } = req.params;
		const userId = req.auth.userId;

		// Find user
		const user = await User.findOne({ clerkId: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Find artist
		const artist = await User.findOne({ 
			artistName: artistName,
			isArtist: true 
		});

		if (!artist) {
			return res.status(404).json({ message: "Artist not found" });
		}

		// Toggle follow
		const isFollowing = artist.followers.includes(user._id);
		
		if (isFollowing) {
			// Unfollow
			await User.findByIdAndUpdate(artist._id, {
				$pull: { followers: user._id }
			});
			await User.findByIdAndUpdate(user._id, {
				$pull: { followedArtists: artistName }
			});
		} else {
			// Follow
			await User.findByIdAndUpdate(artist._id, {
				$push: { followers: user._id }
			});
			await User.findByIdAndUpdate(user._id, {
				$push: { followedArtists: artistName }
			});
		}

		res.status(200).json({ 
			message: isFollowing ? "Unfollowed artist" : "Followed artist",
			isFollowing: !isFollowing
		});
	} catch (error) {
		next(error);
	}
};