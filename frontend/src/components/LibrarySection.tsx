import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { cn } from "@/lib/utils";
import { 
	Heart, 
	Music, 
	User, 
	Album as AlbumIcon,
	Library,
	ArrowRight,
	List,
	Grid3X3,
	Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatePlaylistDialog from "./CreatePlaylistDialog";
import { Input } from "@/components/ui/input";

interface LibrarySectionProps {
	className?: string;
}

const LibrarySection = ({ className }: LibrarySectionProps) => {
	const { userLibrary, fetchUserLibrary, isLoading } = useLibraryStore();
	const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
	const [sortBy, setSortBy] = useState<'recent' | 'alphabetical' | 'creator'>('recent');
	const [filter, setFilter] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		fetchUserLibrary();
	}, [fetchUserLibrary]);

	// Filter and sort library items
	const getFilteredItems = () => {
		if (!userLibrary) return [];

		let items: any[] = [];

		// Add items based on filter
		if (filter === 'all' || filter === 'playlists') {
			// Sort playlists to put "Liked Songs" first
			const sortedPlaylists = [...userLibrary.playlists].sort((a, b) => {
				if (a.isLikedSongs) return -1;
				if (b.isLikedSongs) return 1;
				return 0;
			});

			items.push(...sortedPlaylists.map(playlist => ({
				...playlist,
				type: 'playlist',
				subtitle: playlist.isLikedSongs 
					? `${playlist.songs.length} liked song${playlist.songs.length !== 1 ? 's' : ''}`
					: `Playlist • ${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}`,
				link: `/playlist/${playlist._id}`
			})));
		}

		if (filter === 'all' || filter === 'albums') {
			items.push(...userLibrary.likedAlbums.map(album => ({
				...album,
				type: 'album',
				name: album.title,
				subtitle: `Album • ${album.artist}`,
				link: `/albums/${album._id}`
			})));
		}

		if (filter === 'all' || filter === 'artists') {
			items.push(...userLibrary.followedArtists.map(artist => ({
				_id: artist,
				name: artist,
				type: 'artist',
				imageUrl: '', // Artists don't have images in our simple model
				subtitle: 'Artist',
				link: `/artist/${encodeURIComponent(artist)}`
			})));
		}

		// Apply search filter
		if (searchQuery.trim()) {
			items = items.filter(item => 
				item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(item.artist && item.artist.toLowerCase().includes(searchQuery.toLowerCase()))
			);
		}

		// Sort items (but keep "Liked Songs" at the top for playlists)
		switch (sortBy) {
			case 'alphabetical':
				return items.sort((a, b) => {
					// Keep "Liked Songs" at the top
					if (a.isLikedSongs) return -1;
					if (b.isLikedSongs) return 1;
					return a.name.localeCompare(b.name);
				});
			case 'creator':
				return items.sort((a, b) => {
					// Keep "Liked Songs" at the top
					if (a.isLikedSongs) return -1;
					if (b.isLikedSongs) return 1;
					const aCreator = a.artist || a.userId || '';
					const bCreator = b.artist || b.userId || '';
					return aCreator.localeCompare(bCreator);
				});
			case 'recent':
			default:
				return items.sort((a, b) => {
					// Keep "Liked Songs" at the top
					if (a.isLikedSongs) return -1;
					if (b.isLikedSongs) return 1;
					return new Date(b.createdAt || b.updatedAt || 0).getTime() - 
						   new Date(a.createdAt || a.updatedAt || 0).getTime();
				});
		}
	};

	const filteredItems = getFilteredItems();

	return (
		<div className={cn("flex flex-col h-full", className)}>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-zinc-800">
				<div className="flex items-center gap-3">
					<Library className="h-6 w-6 text-zinc-400" />
					<h2 className="text-white font-semibold">Your Library</h2>
				</div>
				<div className="flex items-center gap-2">
					<CreatePlaylistDialog />
					<Button
						variant="ghost"
						size="sm"
						className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
						onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
					>
						{viewMode === 'list' ? (
							<Grid3X3 className="h-4 w-4" />
						) : (
							<List className="h-4 w-4" />
						)}
					</Button>
				</div>
			</div>

			{/* Quick access to Liked Songs */}
			{userLibrary?.playlists.find(p => p.isLikedSongs) && (
				<div className="px-4 pb-2">
					<Link
						to={`/playlist/${userLibrary.playlists.find(p => p.isLikedSongs)?._id}`}
						className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors group"
					>
						<div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
							<Heart className="w-5 h-5 text-white fill-current" />
						</div>
						<div className="flex-1 hidden md:block">
							<p className="text-white font-medium">Liked Songs</p>
							<p className="text-white/70 text-sm">
								{userLibrary.playlists.find(p => p.isLikedSongs)?.songs.length || 0} songs
							</p>
						</div>
						<ArrowRight className="w-4 h-4 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block" />
					</Link>
				</div>
			)}

			{/* Filters */}
			<div className="p-4 space-y-3">
				<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
					{[
						{ key: 'all', label: 'All' },
						{ key: 'playlists', label: 'Playlists' },
						{ key: 'artists', label: 'Artists' },
						{ key: 'albums', label: 'Albums' },
					].map(({ key, label }) => (
						<Button
							key={key}
							variant={filter === key ? "secondary" : "ghost"}
							size="sm"
							className={cn(
								"whitespace-nowrap",
								filter === key 
									? "bg-white text-black hover:bg-zinc-200" 
									: "text-zinc-400 hover:text-white hover:bg-zinc-800"
							)}
							onClick={() => setFilter(key as any)}
						>
							{label}
						</Button>
					))}
				</div>

				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
					<Input
						placeholder="Search in Your Library"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
					/>
				</div>

				<div className="flex items-center justify-between text-sm">
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as any)}
						className="bg-transparent text-zinc-400 hover:text-white cursor-pointer outline-none"
					>
						<option value="recent">Recently added</option>
						<option value="alphabetical">Alphabetical</option>
						<option value="creator">Creator</option>
					</select>
				</div>
			</div>

			{/* Content */}
			<ScrollArea className="flex-1 px-4">
				{isLoading ? (
					<div className="space-y-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex items-center gap-3 p-2">
								<div className="w-12 h-12 bg-zinc-800 rounded animate-pulse" />
								<div className="flex-1 space-y-2">
									<div className="h-4 bg-zinc-800 rounded animate-pulse" />
									<div className="h-3 bg-zinc-800 rounded animate-pulse w-2/3" />
								</div>
							</div>
						))}
					</div>
				) : filteredItems.length === 0 ? (
					<div className="text-center py-8 text-zinc-400">
						{searchQuery.trim() ? (
							<>
								<Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>No results found for "{searchQuery}"</p>
							</>
						) : (
							<>
								<Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
								<p>Your library is empty</p>
								<p className="text-sm mt-1">Start by creating a playlist or liking some songs</p>
							</>
						)}
					</div>
				) : (
					<div className={cn(
						"space-y-1 pb-4",
						viewMode === 'grid' && "grid grid-cols-2 gap-3 space-y-0"
					)}>
						{filteredItems.map((item) => (
							<Link
								key={`${item.type}-${item._id}`}
								to={item.link}
								className={cn(
									"group flex items-center gap-3 p-2 hover:bg-zinc-800 rounded-md transition-colors",
									viewMode === 'grid' && "flex-col text-center p-3"
								)}
							>
								<div className={cn(
									"relative flex-shrink-0",
									viewMode === 'list' ? "w-12 h-12" : "w-full aspect-square"
								)}>
									{item.imageUrl ? (
										<img
											src={item.imageUrl}
											alt={item.name}
											className={cn(
												"w-full h-full object-cover",
												item.type === 'playlist' || item.type === 'album' ? "rounded" : "rounded-full"
											)}
										/>
									) : (
										<div className={cn(
											"w-full h-full flex items-center justify-center",
											item.type === 'playlist' || item.type === 'album' ? "rounded" : "rounded-full",
											item.type === 'playlist' && item.isLikedSongs 
												? "bg-gradient-to-br from-purple-600 to-blue-600" 
												: "bg-zinc-700"
										)}>
											{item.type === 'playlist' && item.isLikedSongs ? (
												<Heart className="w-6 h-6 text-white fill-current" />
											) : item.type === 'playlist' ? (
												<Music className="w-6 h-6 text-zinc-400" />
											) : item.type === 'album' ? (
												<AlbumIcon className="w-6 h-6 text-zinc-400" />
											) : (
												<User className="w-6 h-6 text-zinc-400" />
											)}
										</div>
									)}
								</div>

								<div className={cn(
									"flex-1 min-w-0",
									viewMode === 'grid' && "text-center mt-2"
								)}>
									<p className={cn(
										"font-medium truncate group-hover:text-white",
										item.type === 'playlist' && item.isLikedSongs 
											? "text-white" 
											: "text-white"
									)}>
										{item.name}
									</p>
									<p className="text-zinc-400 text-sm truncate">
										{item.subtitle}
									</p>
								</div>

								{viewMode === 'list' && (
									<ArrowRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
								)}
							</Link>
						))}
					</div>
				)}
			</ScrollArea>
		</div>
	);
};

export default LibrarySection;