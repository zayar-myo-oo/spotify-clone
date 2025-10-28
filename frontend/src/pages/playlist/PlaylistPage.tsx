import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Playlist } from "@/types";
import { Clock, Heart, MoreHorizontal, Play, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlaylistPage = () => {
	const { id } = useParams<{ id: string }>();
	const [playlist, setPlaylist] = useState<Playlist | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	
	const { getPlaylistById, toggleLikeSong, userLibrary } = useLibraryStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		const fetchPlaylist = async () => {
			if (id) {
				setIsLoading(true);
				const playlistData = await getPlaylistById(id);
				setPlaylist(playlistData);
				setIsLoading(false);
			}
		};

		fetchPlaylist();
	}, [id, getPlaylistById]);

	const isCurrentPlaylist = currentSong && playlist?.songs.some(song => song._id === currentSong._id);

	const handlePlayPlaylist = () => {
		if (!playlist?.songs.length) return;
		
		if (isCurrentPlaylist) {
			togglePlay();
		} else {
			// Play first song of the playlist
			playAlbum(playlist.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!playlist?.songs) return;
		playAlbum(playlist.songs, index);
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	const getTotalDuration = () => {
		if (!playlist?.songs) return "0 min";
		const totalSeconds = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		
		if (hours > 0) {
			return `${hours} hr ${minutes} min`;
		}
		return `${minutes} min`;
	};

	const isLiked = (songId: string) => {
		return userLibrary?.likedSongs.some(song => song._id === songId) || false;
	};

	if (isLoading) {
		return (
			<div className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg">
				<div className="flex flex-col md:flex-row gap-6 p-6">
					<div className="w-60 h-60 bg-zinc-700 rounded-lg animate-pulse" />
					<div className="flex-1 space-y-4">
						<div className="h-8 bg-zinc-700 rounded animate-pulse" />
						<div className="h-6 bg-zinc-700 rounded animate-pulse w-1/3" />
						<div className="h-4 bg-zinc-700 rounded animate-pulse w-1/2" />
					</div>
				</div>
			</div>
		);
	}

	if (!playlist) {
		return (
			<div className="h-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-lg flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-white mb-2">Playlist not found</h2>
					<p className="text-zinc-400">The playlist you're looking for doesn't exist.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full bg-gradient-to-b from-green-800 to-zinc-900 rounded-lg overflow-hidden">
			{/* Header */}
			<div className="flex flex-col md:flex-row gap-6 p-6">
				<div className="w-60 h-60 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
					{playlist.imageUrl ? (
						<img
							src={playlist.imageUrl}
							alt={playlist.name}
							className="w-full h-full object-cover rounded-lg"
						/>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-purple-700 to-blue-700 rounded-lg flex items-center justify-center">
							{playlist.isLikedSongs ? (
								<Heart className="w-16 h-16 text-white fill-current" />
							) : (
								<div className="text-6xl font-bold text-white">♪</div>
							)}
						</div>
					)}
				</div>

				<div className="flex flex-col justify-end">
					<p className="text-sm font-medium text-white mb-2">
						{playlist.isPublic ? "Public" : "Private"} Playlist
					</p>
					<h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
						{playlist.name}
					</h1>
					{playlist.description && (
						<p className="text-zinc-300 mb-4">{playlist.description}</p>
					)}
					<div className="flex items-center gap-2 text-sm text-zinc-300">
						<span>{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}</span>
						{playlist.songs.length > 0 && (
							<>
								<span>•</span>
								<span>{getTotalDuration()}</span>
							</>
						)}
					</div>
				</div>
			</div>

			{/* Controls */}
			<div className="flex items-center gap-6 px-6 pb-6">
				<Button
					onClick={handlePlayPlaylist}
					size="icon"
					className="w-14 h-14 bg-green-500 hover:bg-green-400 text-black rounded-full"
					disabled={!playlist.songs.length}
				>
					{isCurrentPlaylist && isPlaying ? (
						<div className="w-6 h-6 flex items-center justify-center">
							<div className="flex gap-1">
								<div className="w-1 h-4 bg-black animate-pulse" />
								<div className="w-1 h-4 bg-black animate-pulse delay-100" />
								<div className="w-1 h-4 bg-black animate-pulse delay-200" />
							</div>
						</div>
					) : (
						<Play className="w-6 h-6 fill-current" />
					)}
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="text-zinc-400 hover:text-white"
					disabled={!playlist.songs.length}
				>
					<Shuffle className="w-6 h-6" />
				</Button>

				<Button
					variant="ghost"
					size="icon"
					className="text-zinc-400 hover:text-white"
				>
					<MoreHorizontal className="w-6 h-6" />
				</Button>
			</div>

			{/* Songs list */}
			<div className="bg-black/20 flex-1">
				<div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-2 text-sm text-zinc-400 border-b border-white/10">
					<div>#</div>
					<div>Title</div>
					<div className="hidden md:block">Album</div>
					<div>
						<Clock className="w-4 h-4" />
					</div>
				</div>

				<ScrollArea className="h-[calc(100vh-400px)]">
					{playlist.songs.length === 0 ? (
						<div className="text-center py-12 text-zinc-400">
							<p>No songs in this playlist yet</p>
							<p className="text-sm mt-1">Add some songs to get started</p>
						</div>
					) : (
						<div>
							{playlist.songs.map((song, index) => {
								const isCurrentSong = currentSong?._id === song._id;
								const songIsLiked = isLiked(song._id);

								return (
									<div
										key={song._id}
										className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-6 py-2 text-sm text-zinc-400 hover:bg-white/10 group cursor-pointer"
										onClick={() => handlePlaySong(index)}
									>
										<div className="flex items-center">
											{isCurrentSong && isPlaying ? (
												<div className="flex gap-1">
													<div className="w-1 h-3 bg-green-500 animate-pulse" />
													<div className="w-1 h-3 bg-green-500 animate-pulse delay-100" />
													<div className="w-1 h-3 bg-green-500 animate-pulse delay-200" />
												</div>
											) : (
												<span className="group-hover:hidden">
													{index + 1}
												</span>
											)}
											<Play className="w-4 h-4 hidden group-hover:block" />
										</div>

										<div className="flex items-center gap-3">
											<img
												src={song.imageUrl}
												alt={song.title}
												className="w-10 h-10 rounded object-cover"
											/>
											<div>
												<p className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>
													{song.title}
												</p>
												<p className="text-zinc-400">{song.artist}</p>
											</div>
										</div>

										<div className="hidden md:flex items-center">
											<span className="text-zinc-400">{song.title}</span>
										</div>

										<div className="flex items-center justify-between">
											<Button
												variant="ghost"
												size="icon"
												className="w-8 h-8 opacity-0 group-hover:opacity-100"
												onClick={(e) => {
													e.stopPropagation();
													toggleLikeSong(song._id);
												}}
											>
												<Heart 
													className={`w-4 h-4 ${songIsLiked ? 'fill-green-500 text-green-500' : 'text-zinc-400 hover:text-white'}`} 
												/>
											</Button>
											<span>{formatDuration(song.duration)}</span>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</ScrollArea>
			</div>
		</div>
	);
};

export default PlaylistPage;