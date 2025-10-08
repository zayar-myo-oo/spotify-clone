import Topbar from "@/components/Topbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Heart, Play, Pause } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const AllAlbumsPage = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { toggleLikeAlbum, userLibrary } = useLibraryStore();
	const { currentSong, isPlaying, playAlbum } = usePlayerStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const isLiked = (albumId: string) => {
		return userLibrary?.likedAlbums.some(album => album._id === albumId) || false;
	};

	const handlePlayAlbum = (album: any) => {
		if (album.songs && album.songs.length > 0) {
			playAlbum(album.songs, 0);
		}
	};

	const PlayButton = ({ album }: { album: any }) => {
		const isCurrentAlbum = currentSong && album.songs?.some((song: any) => song._id === currentSong._id);

		return (
			<Button
				size="icon"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					handlePlayAlbum(album);
				}}
				className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
					opacity-0 translate-y-2 group-hover:translate-y-0 ${
					isCurrentAlbum ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
			>
				{isCurrentAlbum && isPlaying ? (
					<Pause className="size-5 text-black" />
				) : (
					<Play className="size-5 text-black" />
				)}
			</Button>
		);
	};

	return (
		<main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
			<Topbar />
			<ScrollArea className="h-[calc(100vh-180px)]">
				<div className="p-4 sm:p-6">
					<div className="flex items-center justify-between mb-6">
						<h1 className="text-2xl sm:text-3xl font-bold">All Albums</h1>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{Array.from({ length: 10 }).map((_, i) => (
								<div key={i} className="bg-zinc-800/40 p-4 rounded-md">
									<div className="aspect-square bg-zinc-700 rounded-md mb-4 animate-pulse" />
									<div className="h-4 bg-zinc-700 rounded mb-2 animate-pulse" />
									<div className="h-3 bg-zinc-700 rounded animate-pulse" />
								</div>
							))}
						</div>
					) : albums.length === 0 ? (
						<div className="text-center text-zinc-400 mt-16">
							<p className="text-xl mb-2">No albums available</p>
							<p>Check back later for new releases</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{albums.map((album) => {
								const albumIsLiked = isLiked(album._id);
								
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
													className="w-full h-full object-cover transition-transform duration-300 
													group-hover:scale-105"
												/>
											</div>
											<PlayButton album={album} />
										</div>
										
										<h3 className="font-medium mb-2 truncate">
											{album.title}
										</h3>
										<p className="text-sm text-zinc-400 truncate mb-3">
											{album.artist} • {album.releaseYear}
										</p>

										{/* Action buttons */}
										<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
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
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default AllAlbumsPage;