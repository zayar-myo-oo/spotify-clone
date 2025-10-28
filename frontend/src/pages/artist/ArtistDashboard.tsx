import { useAuthStore } from "@/stores/useAuthStore";
import { useArtistStore } from "@/stores/useArtistStore";
import { useEffect } from "react";
import { Music, Album, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtistAddSongDialog from "./components/ArtistAddSongDialog";
import ArtistSongsTable from "./components/ArtistSongsTable";
import ArtistAlbumsTable from "./components/ArtistAlbumsTable";

const ArtistDashboard = () => {
	const { isArtist, isLoading } = useAuthStore();
	const { fetchArtistAlbums, fetchArtistSongs, fetchArtistFollowers, albums, songs, followers } = useArtistStore();

	useEffect(() => {
		fetchArtistAlbums();
		fetchArtistSongs();
		fetchArtistFollowers();
	}, [fetchArtistAlbums, fetchArtistSongs, fetchArtistFollowers]);

	if (!isArtist && !isLoading) return <div>Unauthorized - Artist access only</div>;

	return (
		<div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold">Artist Dashboard</h1>
					<p className="text-zinc-400 mt-2">Manage your music and track your followers</p>
				</div>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<div className="bg-zinc-800/50 p-6 rounded-lg">
					<div className="flex items-center gap-4">
						<Music className="h-8 w-8 text-emerald-500" />
						<div>
							<p className="text-sm text-zinc-400">Total Songs</p>
							<p className="text-2xl font-bold">{songs.length}</p>
						</div>
					</div>
				</div>
				<div className="bg-zinc-800/50 p-6 rounded-lg">
					<div className="flex items-center gap-4">
						<Album className="h-8 w-8 text-blue-500" />
						<div>
							<p className="text-sm text-zinc-400">Total Albums</p>
							<p className="text-2xl font-bold">{albums.length}</p>
						</div>
					</div>
				</div>
				<div className="bg-zinc-800/50 p-6 rounded-lg">
					<div className="flex items-center gap-4">
						<Users className="h-8 w-8 text-purple-500" />
						<div>
							<p className="text-sm text-zinc-400">Followers</p>
							<p className="text-2xl font-bold">{followers.length}</p>
						</div>
					</div>
				</div>
			</div>

			<Tabs defaultValue="songs" className="space-y-6">
				<TabsList className="p-1 bg-zinc-800/50">
					<TabsTrigger value="songs" className="data-[state=active]:bg-zinc-700">
						<Music className="mr-2 size-4" />
						Songs
					</TabsTrigger>
					<TabsTrigger value="albums" className="data-[state=active]:bg-zinc-700">
						<Album className="mr-2 size-4" />
						Albums
					</TabsTrigger>
					<TabsTrigger value="followers" className="data-[state=active]:bg-zinc-700">
						<Users className="mr-2 size-4" />
						Followers
					</TabsTrigger>
				</TabsList>

				<TabsContent value="songs">
					<div className="bg-zinc-800/50 rounded-lg p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold">My Songs</h2>
							<ArtistAddSongDialog />
						</div>
						<ArtistSongsTable />
					</div>
				</TabsContent>

				<TabsContent value="albums">
					<div className="bg-zinc-800/50 rounded-lg p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold">My Albums</h2>
						</div>
						<ArtistAlbumsTable />
					</div>
				</TabsContent>

				<TabsContent value="followers">
					<div className="bg-zinc-800/50 rounded-lg p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-semibold">My Followers</h2>
							<span className="text-zinc-400">{followers.length} followers</span>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{followers.map((follower) => (
								<div key={follower._id} className="flex items-center gap-3 p-4 bg-zinc-700/50 rounded-lg">
									<img src={follower.imageUrl} alt={follower.fullName} className="w-12 h-12 rounded-full" />
									<div>
										<h3 className="font-medium text-white">{follower.fullName}</h3>
										<p className="text-sm text-zinc-400">Follower</p>
									</div>
								</div>
							))}
						</div>
						{followers.length === 0 && (
							<div className="text-center py-8 text-zinc-400">
								No followers yet
							</div>
						)}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ArtistDashboard;