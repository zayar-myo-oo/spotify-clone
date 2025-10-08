import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Album } from "@/types";
import { Heart, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface AlbumGridProps {
	title: string;
	albums: Album[];
	isLoading: boolean;
}

const AlbumGrid = ({ title, albums, isLoading }: AlbumGridProps) => {
	const { currentSong, isPlaying, playAlbum } = usePlayerStore();
	const { toggleLikeAlbum, userLibrary } = useLibraryStore();

	console.log("AlbumGrid - Albums:", albums, "Length:", albums.length, "IsLoading:", isLoading);

	const isLikedAlbum = (albumId: string) => {
		return userLibrary?.likedAlbums.some(album => album._id === albumId) || false;
	};

	const handlePlayAlbum = (album: Album) => {
		if (album.songs && album.songs.length > 0) {
			playAlbum(album.songs, 0);
		}
	};

	const isAlbumPlaying = (album: Album) => {
		return currentSong && album.songs?.some(song => song._id === currentSong._id);
	};

	const PlayButton = ({ album }: { album: Album }) => {
		const albumPlaying = isAlbumPlaying(album);

		return (
			<Button
				size="icon"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handlePlayAlbum(album);
				}}
				className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 ${
					albumPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
			>
				{albumPlaying && isPlaying ? (
					<Pause className="size-5 text-black" />
				) : (
					<Play className="size-5 text-black" />
				)}
			</Button>
		);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="bg-zinc-800/40 p-4 rounded-md">
							<div className="aspect-square rounded-md bg-zinc-700 animate-pulse mb-4" />
							<div className="h-4 bg-zinc-700 rounded animate-pulse mb-2" />
							<div className="h-3 bg-zinc-700 rounded animate-pulse w-2/3" />
						</div>
					))}
				</div>
			</div>
		);
	}

	if (!albums.length && !isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
				</div>
				<div className="text-center text-zinc-400 py-8">
					<p>No albums available</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
				{albums.length > 0 && (
					<Link 
						to="/albums"
						className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
					>
						Show all
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{albums.slice(0, 4).map((album) => {
					const albumIsLiked = isLikedAlbum(album._id);

					return (
						<Link
							key={album._id}
							to={`/albums/${album._id}`}
							className="bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer"
						>
							<div className="relative mb-4">
								<div className="aspect-square rounded-md shadow-lg overflow-hidden">
									<img
										src={album.imageUrl}
										alt={album.title}
										className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
								<PlayButton album={album} />
							</div>

							<h3 className="font-medium mb-2 truncate">{album.title}</h3>
							<p className="text-sm text-zinc-400 truncate mb-3">{album.artist}</p>
							<p className="text-xs text-zinc-500">{album.releaseYear}</p>

							{/* Action buttons */}
							<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity mt-3">
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-zinc-400 hover:text-white"
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											toggleLikeAlbum(album._id);
										}}
									>
										<Heart 
											className={`h-4 w-4 ${albumIsLiked ? 'fill-green-500 text-green-500' : ''}`} 
										/>
									</Button>
								</div>
								
								<div className="text-xs text-zinc-500">
									{album.songs?.length || 0} song{(album.songs?.length || 0) !== 1 ? 's' : ''}
								</div>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};

export default AlbumGrid;