import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Album, Song } from "@/types";
import { Heart, Play, UserPlus, UserMinus, Music } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ArtistProfile {
	_id: string;
	artistName: string;
	fullName: string;
	imageUrl: string;
	artistProfileImage: string;
	artistBio?: string;
	genre?: string;
	followers: any[];
	followerCount: number;
}

interface ArtistData {
	artist: ArtistProfile;
	songs: Song[];
	albums: Album[];
	recommendedSongs: Song[];
}

const ArtistProfilePage = () => {
	const { artistName } = useParams();
	const navigate = useNavigate();
	const [artistData, setArtistData] = useState<ArtistData | null>(null);
	const [isFollowing, setIsFollowing] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const { setCurrentSong, currentSong, playAlbum } = usePlayerStore();
	const { toggleLikeSong, userLibrary } = useLibraryStore();

	const fetchArtistProfile = async () => {
		try {
			setIsLoading(true);
			const response = await axiosInstance.get(`/artist-profile/${artistName}`);
			setArtistData(response.data);
			
			// Check if user is following this artist
			const following = userLibrary?.followedArtists?.includes(artistName || '') || false;
			setIsFollowing(following);
		} catch (error) {
			console.error("Error fetching artist profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFollow = async () => {
		try {
			await axiosInstance.post(`/artist-profile/${artistName}/follow`);
			setIsFollowing(!isFollowing);
			// Update follower count
			if (artistData) {
				setArtistData({
					...artistData,
					artist: {
						...artistData.artist,
						followerCount: isFollowing 
							? artistData.artist.followerCount - 1 
							: artistData.artist.followerCount + 1
					}
				});
			}
		} catch (error) {
			console.error("Error following artist:", error);
		}
	};

	const handlePlaySong = (song: Song) => {
		setCurrentSong(song);
	};

	const handlePlayAllSongs = () => {
		if (artistData?.songs.length) {
			playAlbum(artistData.songs, 0);
		}
	};

	const isSongLiked = (songId: string) => {
		return userLibrary?.likedSongs.some(s => s._id === songId) || false;
	};

	useEffect(() => {
		if (artistName) {
			fetchArtistProfile();
		}
	}, [artistName]);

	if (isLoading) {
		return <div className="text-center py-8">Loading artist profile...</div>;
	}

	if (!artistData) {
		return <div className="text-center py-8">Artist not found</div>;
	}

	const { artist, songs, albums, recommendedSongs } = artistData;

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				<div className="relative min-h-full">
					{/* Background gradient */}
					<div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-zinc-900/80 to-zinc-900 pointer-events-none" />

					{/* Content */}
					<div className="relative z-10">
						{/* Artist Header */}
						<div className="flex p-6 gap-6 pb-8">
							<img
								src={artist.artistProfileImage}
								alt={artist.artistName}
								className="w-[240px] h-[240px] shadow-xl rounded-full object-cover"
							/>
							<div className="flex flex-col justify-end">
								<p className="text-sm font-medium">Artist</p>
								<h1 className="text-7xl font-bold my-4">{artist.artistName}</h1>
								<div className="flex items-center gap-2 text-sm text-zinc-100">
									<span>{artist.followerCount.toLocaleString()} followers</span>
									{artist.genre && <span>• {artist.genre}</span>}
								</div>
								{artist.artistBio && (
									<p className="text-zinc-300 mt-2 max-w-2xl">{artist.artistBio}</p>
								)}
							</div>
						</div>

						{/* Action buttons */}
						<div className="px-6 pb-6 flex items-center gap-6">
							<Button
								onClick={handlePlayAllSongs}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
							>
								<Play className="h-7 w-7 text-black" />
							</Button>

							<Button
								onClick={handleFollow}
								variant="outline"
								className={`px-6 ${isFollowing ? 'bg-zinc-800 text-white' : 'bg-transparent border-white text-white hover:bg-white hover:text-black'}`}
							>
								{isFollowing ? (
									<><UserMinus className="w-4 h-4 mr-2" />Following</>
								) : (
									<><UserPlus className="w-4 h-4 mr-2" />Follow</>
								)}
							</Button>
						</div>

						{/* Popular Songs */}
						<div className="px-6 mb-8">
							<h2 className="text-2xl font-bold mb-4">Popular</h2>
							<div className="space-y-2">
								{songs.slice(0, 5).map((song, index) => (
									<div
										key={song._id}
										className="flex items-center gap-4 p-2 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-pointer"
										onClick={() => handlePlaySong(song)}
									>
										<span className="text-zinc-400 w-4">{index + 1}</span>
										<img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded" />
										<div className="flex-1">
											<h3 className={`font-medium ${currentSong?._id === song._id ? 'text-green-400' : 'text-white'}`}>
												{song.title}
											</h3>
										</div>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500"
											onClick={(e) => {
												e.stopPropagation();
												toggleLikeSong(song._id);
											}}
										>
											<Heart className={`h-4 w-4 ${isSongLiked(song._id) ? 'fill-red-500 text-red-500' : ''}`} />
										</Button>
									</div>
								))}
							</div>
						</div>

						{/* Albums */}
						{albums.length > 0 && (
							<div className="px-6 mb-8">
								<h2 className="text-2xl font-bold mb-4">Albums</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
									{albums.map((album) => (
										<div
											key={album._id}
											className="bg-zinc-800/40 p-4 rounded-lg hover:bg-zinc-700/40 transition-all group cursor-pointer"
											onClick={() => navigate(`/albums/${album._id}`)}
										>
											<div className="aspect-square rounded-full overflow-hidden mb-4">
												<img
													src={album.imageUrl}
													alt={album.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform"
												/>
											</div>
											<h3 className="font-medium truncate">{album.title}</h3>
											<p className="text-sm text-zinc-400">{album.releaseYear}</p>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Recommended Songs */}
						{recommendedSongs.length > 0 && (
							<div className="px-6 mb-8">
								<h2 className="text-2xl font-bold mb-4">You might also like</h2>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{recommendedSongs.slice(0, 6).map((song) => (
										<div
											key={song._id}
											className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-pointer"
											onClick={() => handlePlaySong(song)}
										>
											<img src={song.imageUrl} alt={song.title} className="w-12 h-12 rounded" />
											<div className="flex-1 min-w-0">
												<h3 className="font-medium truncate">{song.title}</h3>
												<p className="text-sm text-zinc-400 truncate">{song.artist}</p>
											</div>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100"
												onClick={(e) => {
													e.stopPropagation();
													handlePlaySong(song);
												}}
											>
												<Play className="h-4 w-4" />
											</Button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ArtistProfilePage;