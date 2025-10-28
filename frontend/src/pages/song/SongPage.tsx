import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Clock, Heart, MoreHorizontal, Pause, Play, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";
import { Song } from "@/types";

const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const SongPage = () => {
	const { songId } = useParams();
	const { songs, fetchSongs } = useMusicStore();
	const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();
	const { toggleLikeSong, userLibrary, fetchUserLibrary } = useLibraryStore();
	const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);

	const song = songs.find(s => s._id === songId);

	useEffect(() => {
		fetchUserLibrary();
		if (songs.length === 0) {
			fetchSongs();
		}
	}, [fetchUserLibrary, fetchSongs, songs.length]);

	if (songs.length === 0) return <div className="text-center py-8">Loading...</div>;
	if (!song) return <div className="text-center py-8">Song not found</div>;

	const handlePlaySong = () => {
		if (currentSong?._id === song._id) {
			togglePlay();
		} else {
			setCurrentSong(song);
		}
	};

	const isSongLiked = () => {
		return userLibrary?.likedSongs.some(s => s._id === song._id) || false;
	};

	const isCurrentSong = currentSong?._id === song._id;

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				<div className="relative min-h-full">
					{/* Background gradient */}
					<div
						className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
						aria-hidden="true"
					/>

					{/* Content */}
					<div className="relative z-10">
						<div className="flex p-6 gap-6 pb-8">
							<img
								src={song.imageUrl}
								alt={song.title}
								className="w-[240px] h-[240px] shadow-xl rounded"
							/>
							<div className="flex flex-col justify-end">
								<p className="text-sm font-medium">Song</p>
								<h1 className="text-7xl font-bold my-4">{song.title}</h1>
								<div className="flex items-center gap-2 text-sm text-zinc-100">
									<span className="font-medium text-white">{song.artist}</span>
									<span>• {formatDuration(song.duration)}</span>
									<span>• {new Date(song.createdAt).getFullYear()}</span>
								</div>
							</div>
						</div>

						{/* Action buttons */}
						<div className="px-6 pb-4 flex items-center gap-6">
							<Button
								onClick={handlePlaySong}
								size="icon"
								className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
							>
								{isPlaying && isCurrentSong ? (
									<Pause className="h-7 w-7 text-black" />
								) : (
									<Play className="h-7 w-7 text-black" />
								)}
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-zinc-400 hover:text-white"
								onClick={() => toggleLikeSong(song._id)}
							>
								<Heart
									className={`w-8 h-8 ${isSongLiked() ? 'fill-green-500 text-green-500' : ''}`}
								/>
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-zinc-400 hover:text-white"
								onClick={() => setSelectedSongForPlaylist(song)}
							>
								<Plus className="w-8 h-8" />
							</Button>

							<Button
								variant="ghost"
								size="icon"
								className="w-8 h-8 text-zinc-400 hover:text-white"
							>
								<MoreHorizontal className="w-8 h-8" />
							</Button>
						</div>

						{/* Song details table */}
						<div className="bg-black/20 backdrop-blur-sm">
							<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
								<div>#</div>
								<div>Title</div>
								<div>Release Date</div>
								<div>
									<Clock className="h-4 w-4" />
								</div>
							</div>

							<div className="px-6">
								<div className="space-y-2 py-4">
									<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group">
										<div className="flex items-center justify-center">
											{isCurrentSong && isPlaying ? (
												<div className="size-4 text-green-500">♫</div>
											) : (
												<span>1</span>
											)}
										</div>

										<div className="flex items-center gap-3">
											<img src={song.imageUrl} alt={song.title} className="size-10" />
											<div>
												<div className="font-medium text-white">{song.title}</div>
												<div>{song.artist}</div>
											</div>
										</div>

										<div className="flex items-center">{song.createdAt.split("T")[0]}</div>
										<div className="flex items-center">{formatDuration(song.duration)}</div>
									</div>
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

export default SongPage;