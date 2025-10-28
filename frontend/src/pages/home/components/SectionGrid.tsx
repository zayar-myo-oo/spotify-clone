import { Song } from "@/types";
import SectionGridSkeleton from "./SectionGridSkeleton";
import { Button } from "@/components/ui/button";
import PlayButton from "./PlayButton";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Heart, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import AddToPlaylistDialog from "@/components/AddToPlaylistDialog";
import { useNavigate } from "react-router-dom";

type SectionGridProps = {
	title: string;
	songs: Song[];
	isLoading: boolean;
};

const SectionGrid = ({ songs, title, isLoading }: SectionGridProps) => {
	const { toggleLikeSong, userLibrary } = useLibraryStore();
	const { currentSong } = usePlayerStore();
	const [selectedSongForPlaylist, setSelectedSongForPlaylist] = useState<Song | null>(null);
	const navigate = useNavigate();

	const isLiked = (songId: string) => {
		return userLibrary?.likedSongs.some(song => song._id === songId) || false;
	};

	if (isLoading) return <SectionGridSkeleton />;

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between mb-4'>
				<h2 className='text-xl sm:text-2xl font-bold'>{title}</h2>
				<Button variant='link' className='text-sm text-zinc-400 hover:text-white'>
					Show all
				</Button>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{songs.map((song) => {
					const songIsLiked = isLiked(song._id);
					
					return (
						<div
							key={song._id}
							className='bg-zinc-800/40 p-4 rounded-md hover:bg-zinc-700/40 transition-all group cursor-pointer'
							onClick={() => navigate(`/song/${song._id}`)}
						>
							<div className='relative mb-4'>
								<div className='aspect-square rounded-md shadow-lg overflow-hidden'>
									<img
										src={song.imageUrl}
										alt={song.title}
										className='w-full h-full object-cover transition-transform duration-300 
										group-hover:scale-105'
									/>
								</div>
								<PlayButton song={song} />
							</div>
							
							<div className='flex items-center justify-between mb-2'>
								<h3 className='font-medium truncate flex-1'>{song.title}</h3>
								{currentSong?._id === song._id && (
									<Button
										variant="ghost"
										size="icon"
										className="h-6 w-6 text-zinc-400 hover:text-red-500 ml-2"
										onClick={(e) => {
											e.stopPropagation();
											toggleLikeSong(song._id);
										}}
									>
										<Heart 
											className={`h-4 w-4 ${songIsLiked ? 'fill-red-500 text-red-500' : ''}`} 
										/>
									</Button>
								)}
							</div>
							<p 
								className='text-sm text-zinc-400 truncate mb-3 hover:text-white hover:underline cursor-pointer'
								onClick={(e) => {
									e.stopPropagation();
									navigate(`/artist/${encodeURIComponent(song.artist)}`);
								}}
							>
								{song.artist}
							</p>

							{/* Action buttons */}
							<div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-zinc-400 hover:text-white"
										onClick={(e) => {
											e.stopPropagation();
											toggleLikeSong(song._id);
										}}
									>
										<Heart 
											className={`h-4 w-4 ${songIsLiked ? 'fill-green-500 text-green-500' : ''}`} 
										/>
									</Button>
									
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 text-zinc-400 hover:text-white"
										onClick={(e) => {
											e.stopPropagation();
											setSelectedSongForPlaylist(song);
										}}
									>
										<Plus className="h-4 w-4" />
									</Button>
								</div>
								
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-zinc-400 hover:text-white"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</div>
						</div>
					);
				})}
			</div>

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
export default SectionGrid;
