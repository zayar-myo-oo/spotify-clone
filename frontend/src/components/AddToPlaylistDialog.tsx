import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { Song } from "@/types";
import { Check, Heart, Music, Plus } from "lucide-react";
import { useState } from "react";
import CreatePlaylistDialog from "./CreatePlaylistDialog";

interface AddToPlaylistDialogProps {
	song: Song;
	isOpen: boolean;
	onClose: () => void;
}

const AddToPlaylistDialog = ({ song, isOpen, onClose }: AddToPlaylistDialogProps) => {
	const { userLibrary, addSongToPlaylist, toggleLikeSong } = useLibraryStore();
	const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);

	const handleAddToPlaylist = async (playlistId: string) => {
		setAddingToPlaylist(playlistId);
		await addSongToPlaylist(playlistId, song._id);
		setAddingToPlaylist(null);
		onClose();
	};

	const handleAddToLikedSongs = async () => {
		setAddingToPlaylist('liked-songs');
		await toggleLikeSong(song._id);
		setAddingToPlaylist(null);
		onClose();
	};

	const isSongInPlaylist = (playlistId: string) => {
		const playlist = userLibrary?.playlists.find(p => p._id === playlistId);
		return playlist?.songs.some(s => s._id === song._id) || false;
	};

	const isSongLiked = () => {
		return userLibrary?.likedSongs.some(s => s._id === song._id) || false;
	};

	const otherPlaylists = userLibrary?.playlists.filter(p => !p.isLikedSongs) || [];

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
				<DialogHeader>
					<DialogTitle className="text-white">Add to playlist</DialogTitle>
				</DialogHeader>
				
				<div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
					<img
						src={song.imageUrl}
						alt={song.title}
						className="w-10 h-10 rounded object-cover"
					/>
					<div>
						<p className="text-white font-medium truncate">{song.title}</p>
						<p className="text-zinc-400 text-sm truncate">{song.artist}</p>
					</div>
				</div>

				<div className="space-y-4">
					{/* Liked Songs - Default Option */}
					<div>
						<p className="text-white font-medium mb-2">Quick add</p>
						<Button
							variant="ghost"
							className="w-full justify-start h-auto p-3 text-left hover:bg-zinc-800"
							onClick={handleAddToLikedSongs}
							disabled={addingToPlaylist === 'liked-songs'}
						>
							<div className="flex items-center gap-3 w-full">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-blue-700 rounded flex items-center justify-center flex-shrink-0">
									<Heart className="w-5 h-5 text-white fill-current" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-white font-medium truncate">
										Liked Songs
									</p>
									<p className="text-zinc-400 text-sm truncate">
										{userLibrary?.likedSongs.length || 0} song{(userLibrary?.likedSongs.length || 0) !== 1 ? 's' : ''}
									</p>
								</div>
								{isSongLiked() ? (
									<Check className="w-5 h-5 text-green-500 flex-shrink-0" />
								) : addingToPlaylist === 'liked-songs' ? (
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
								) : (
									<Plus className="w-5 h-5 text-zinc-400 flex-shrink-0" />
								)}
							</div>
						</Button>
					</div>

					{/* Other Playlists */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-white font-medium">Your playlists</p>
							<CreatePlaylistDialog />
						</div>

						{otherPlaylists.length === 0 ? (
							<div className="text-center py-8 text-zinc-400">
								<Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
								<p className="text-sm">No playlists yet</p>
								<p className="text-xs mt-1">Create your first playlist!</p>
							</div>
						) : (
							<ScrollArea className="h-48">
								<div className="space-y-1">
									{otherPlaylists.map((playlist) => {
										const songInPlaylist = isSongInPlaylist(playlist._id);
										const isAdding = addingToPlaylist === playlist._id;

										return (
											<Button
												key={playlist._id}
												variant="ghost"
												className="w-full justify-start h-auto p-3 text-left hover:bg-zinc-800"
												onClick={() => handleAddToPlaylist(playlist._id)}
												disabled={songInPlaylist || isAdding}
											>
												<div className="flex items-center gap-3 w-full">
													<div className="w-10 h-10 bg-zinc-700 rounded flex items-center justify-center flex-shrink-0">
														{playlist.imageUrl ? (
															<img
																src={playlist.imageUrl}
																alt={playlist.name}
																className="w-full h-full rounded object-cover"
															/>
														) : (
															<Music className="w-5 h-5 text-zinc-400" />
														)}
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-white font-medium truncate">
															{playlist.name}
														</p>
														<p className="text-zinc-400 text-sm truncate">
															{playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
														</p>
													</div>
													{songInPlaylist ? (
														<Check className="w-5 h-5 text-green-500 flex-shrink-0" />
													) : isAdding ? (
														<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex-shrink-0" />
													) : (
														<Plus className="w-5 h-5 text-zinc-400 flex-shrink-0" />
													)}
												</div>
											</Button>
										);
									})}
								</div>
							</ScrollArea>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default AddToPlaylistDialog;