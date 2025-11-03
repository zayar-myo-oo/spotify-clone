import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music, Users, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import ArtistRequestsTable from "./components/ArtistRequestsTable";
import AdminSongStats from "./components/AdminSongStats";
import TopArtistsChart from "./components/TopArtistsChart";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats, fetchAdminAnalytics } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
		fetchAdminAnalytics();
	}, [fetchAlbums, fetchSongs, fetchStats, fetchAdminAnalytics]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='analytics' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='analytics' className='data-[state=active]:bg-zinc-700'>
						<BarChart3 className='mr-2 size-4' />
						Analytics
					</TabsTrigger>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
					<TabsTrigger value='artist-requests' className='data-[state=active]:bg-zinc-700'>
						<Users className='mr-2 size-4' />
						Artist Requests
					</TabsTrigger>
				</TabsList>

				<TabsContent value='analytics'>
					<div className='space-y-6'>
						<AdminSongStats />
						<TopArtistsChart />
					</div>
				</TabsContent>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
				<TabsContent value='artist-requests'>
					<div className='bg-zinc-800/50 rounded-lg p-6'>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-xl font-semibold'>Artist Requests</h2>
						</div>
						<ArtistRequestsTable />
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
