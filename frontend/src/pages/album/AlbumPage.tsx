import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Clock, Heart, MoreHorizontal, Pause, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";
import { useNavigate } from "react-router-dom";
import { Song } from "@/types";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
	const { 
		toggleLikeAlbum, 
		toggleLikeSong, 
		userLibrary, 
		fetchUserLibrary
	} = useLibraryStore();
	
	const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
		fetchUserLibrary();
	}, [fetchAlbumById, albumId, fetchUserLibrary]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// start playing the album from the beginning
			playAlbum(currentAlbum?.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;

		playAlbum(currentAlbum?.songs, index);
	};

	const isAlbumLiked = () => {
		if (!currentAlbum || !userLibrary) return false;
		return userLibrary.likedAlbums.some(album => album._id === currentAlbum._id);
	};

	const isSongLiked = (songId: string) => {
		return userLibrary?.likedSongs.some(song => song._id === songId) || false;
	};

	const handleQuickAddToLikedSongs = async (song: Song, e: React.MouseEvent) => {
		e.stopPropagation();
		
		// Check if song is already liked
		const isLiked = isSongLiked(song._id);
		
		if (isLiked) {
			// If already liked, remove from liked songs
			await toggleLikeSong(song._id);
		} else {
			// If not liked, add to liked songs (this will automatically add to "Liked Songs" playlist)
			await toggleLikeSong(song._id);
		}
	};

	const handleAddToPlaylist = (song: Song, e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedSongForPlaylist(song);
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex p-6 gap-6 pb-8'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='w-[240px] h-[240px] shadow-xl rounded'
							/>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='text-7xl font-bold my-4'>{currentAlbum?.title}</h1>
								<div className='flex items-center gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									<span>• {currentAlbum?.songs.length} songs</span>
									<span>• {currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>

						{/* Action buttons */}
						<div className='px-6 pb-4 flex items-center gap-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 
                hover:scale-105 transition-all'
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-7 w-7 text-black' />
								) : (
									<Play className='h-7 w-7 text-black' />
								)}
							</Button>

							{/* Add to Library button */}
							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-zinc-400 hover:text-white"
								onClick={() => currentAlbum && toggleLikeAlbum(currentAlbum._id)}
							>
								<Heart 
									className={`w-8 h-8 ${isAlbumLiked() ? 'fill-green-500 text-green-500' : ''}`} 
								/>
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-zinc-400 hover:text-white"
							>
								<MoreHorizontal className="w-8 h-8" />
							</Button>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* table header */}
							<div
								className='grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5'
							>
								<div>#</div>
								<div>Title</div>
								<div>Released Date</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
								<div className="w-12"></div>
							</div>

							{/* songs list */}
							<div className='px-6'>
								<div className='space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										const songIsLiked = isSongLiked(song._id);
										
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												onContextMenu={(e) => {
													e.preventDefault();
													navigate(`/song/${song._id}`);
												}}
												className={`grid grid-cols-[16px_4fr_2fr_1fr_auto] gap-4 px-4 py-2 text-sm 
                      text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer
                      `}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500'>♫</div>
													) : (
														<span className='group-hover:hidden'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-4 w-4 hidden group-hover:block' />
													)}
												</div>

												<div className='flex items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10' />

													<div>
														<div className={`font-medium text-white`}>{song.title}</div>
														<div 
															className='hover:text-white hover:underline cursor-pointer'
															onClick={(e) => {
																e.stopPropagation();
																navigate(`/artist/${encodeURIComponent(song.artist)}`);
															}}
														>
															{song.artist}
														</div>
													</div>
												</div>
												<div className='flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='flex items-center'>{formatDuration(song.duration)}</div>
												
												{/* Action buttons */}
												<div className='flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
													<Button
														variant="ghost"
														size="icon"
														className="w-8 h-8 text-zinc-400 hover:text-white"
														onClick={(e) => handleQuickAddToLikedSongs(song, e)}
														title={songIsLiked ? "Remove from Liked Songs" : "Add to Liked Songs"}
													>
														<Heart 
															className={`w-4 h-4 ${songIsLiked ? 'fill-green-500 text-green-500' : ''}`} 
														/>
													</Button>
													
													<Button
														variant="ghost"
														size="icon"
														className="w-8 h-8 text-zinc-400 hover:text-white"
														onClick={(e) => handleAddToPlaylist(song, e)}
														title="Add to playlist"
													>
														<Plus className="w-4 h-4" />
													</Button>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>

			{/* Add to Playlist Dialog */}
			{selectedSongForPlaylist && (
				<AddToPlaylistDialog
					song={selectedSongForPlaylist}
					isOpen={!!selectedSongForPlaylist}
					onClose={() => setSelectedSongForPlaylist(null)}
				/>
			)}
		</div>
	);
};
export default AlbumPage;
