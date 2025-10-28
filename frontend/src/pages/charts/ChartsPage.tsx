import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { axiosInstance } from "@/lib/axios";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useLibraryStore } from "@/stores/useLibraryStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song } from "@/types";
import { Heart, Play, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface TopSong extends Song {
	weeklyPlays: number;
	monthlyPlays: number;
}

const ChartsPage = () => {
	const [weeklyTop, setWeeklyTop] = useState<TopSong[]>([]);
	const [monthlyTop, setMonthlyTop] = useState<TopSong[]>([]);
	const [allTimeTop, setAllTimeTop] = useState<TopSong[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const { setCurrentSong, currentSong, isPlaying } = usePlayerStore();
	const { toggleLikeSong, userLibrary } = useLibraryStore();
	const { fetchSongs } = useMusicStore();

	const fetchTopSongs = async () => {
		try {
			setIsLoading(true);
			const [weekly, monthly, alltime] = await Promise.all([
				axiosInstance.get("/charts/top?period=weekly&limit=10"),
				axiosInstance.get("/charts/top?period=monthly&limit=10"),
				axiosInstance.get("/charts/top?period=alltime&limit=10")
			]);

			setWeeklyTop(weekly.data);
			setMonthlyTop(monthly.data);
			setAllTimeTop(alltime.data);
		} catch (error) {
			console.error("Error fetching top songs:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTopSongs();
		fetchSongs();
		userLibrary || useLibraryStore.getState().fetchUserLibrary();
	}, [fetchSongs]);

	const handlePlaySong = (song: TopSong) => {
		setCurrentSong(song);
	};

	const isSongLiked = (songId: string) => {
		return userLibrary?.likedSongs.some(s => s._id === songId) || false;
	};

	const renderTopSongs = (songs: TopSong[], period: string) => (
		<div className="space-y-2">
			{songs.map((song, index) => {
				const isCurrentSong = currentSong?._id === song._id;
				const isTop3 = index < 3;
				
				return (
					<div
						key={song._id}
						className={`flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group cursor-pointer ${
							isCurrentSong ? 'bg-zinc-800/70' : ''
						}`}
						onClick={() => handlePlaySong(song)}
					>
						{/* Rank */}
						<div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg ${
							isTop3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black' : 'text-zinc-400'
						}`}>
							{isTop3 ? <Trophy className="h-4 w-4" /> : index + 1}
						</div>

						{/* Song Info */}
						<img src={song.imageUrl} alt={song.title} className="w-12 h-12 rounded object-cover" />
						
						<div className="flex-1 min-w-0">
							<h3 className={`font-medium truncate ${isCurrentSong ? 'text-green-400' : 'text-white'}`}>
								{song.title}
							</h3>
							<p className="text-sm text-zinc-400 truncate">{song.artist}</p>
						</div>

						{/* Play Count */}
						<div className="text-right">
							<div className="text-sm font-medium text-white">
								{period === 'weekly' ? song.weeklyPlays : 
								 period === 'monthly' ? song.monthlyPlays : 
								 song.playCount} plays
							</div>
							<div className="text-xs text-zinc-400">
								{period === 'weekly' ? 'This week' : 
								 period === 'monthly' ? 'This month' : 
								 'All time'}
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-zinc-400 hover:text-white"
								onClick={(e) => {
									e.stopPropagation();
									handlePlaySong(song);
								}}
							>
								<Play className="h-4 w-4" />
							</Button>
							
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-zinc-400 hover:text-red-500"
								onClick={(e) => {
									e.stopPropagation();
									toggleLikeSong(song._id);
								}}
							>
								<Heart className={`h-4 w-4 ${isSongLiked(song._id) ? 'fill-red-500 text-red-500' : ''}`} />
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);

	if (isLoading) {
		return <div className="text-center py-8">Loading charts...</div>;
	}

	return (
		<div className="h-full">
			<ScrollArea className="h-full rounded-md">
				<div className="p-6">
					<div className="mb-8">
						<h1 className="text-4xl font-bold mb-2">Top Charts</h1>
						<p className="text-zinc-400">Most played songs on the platform</p>
					</div>

					<Tabs defaultValue="weekly" className="space-y-6">
						<TabsList className="grid w-full grid-cols-3 bg-zinc-800/50">
							<TabsTrigger value="weekly" className="data-[state=active]:bg-zinc-700">
								This Week
							</TabsTrigger>
							<TabsTrigger value="monthly" className="data-[state=active]:bg-zinc-700">
								This Month
							</TabsTrigger>
							<TabsTrigger value="alltime" className="data-[state=active]:bg-zinc-700">
								All Time
							</TabsTrigger>
						</TabsList>

						<TabsContent value="weekly" className="space-y-4">
							<div className="bg-zinc-900/50 rounded-lg p-6">
								<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
									<Trophy className="h-6 w-6 text-yellow-500" />
									Top 10 This Week
								</h2>
								{renderTopSongs(weeklyTop, 'weekly')}
							</div>
						</TabsContent>

						<TabsContent value="monthly" className="space-y-4">
							<div className="bg-zinc-900/50 rounded-lg p-6">
								<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
									<Trophy className="h-6 w-6 text-yellow-500" />
									Top 10 This Month
								</h2>
								{renderTopSongs(monthlyTop, 'monthly')}
							</div>
						</TabsContent>

						<TabsContent value="alltime" className="space-y-4">
							<div className="bg-zinc-900/50 rounded-lg p-6">
								<h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
									<Trophy className="h-6 w-6 text-yellow-500" />
									Top 10 All Time
								</h2>
								{renderTopSongs(allTimeTop, 'alltime')}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</ScrollArea>
		</div>
	);
};

export default ChartsPage;