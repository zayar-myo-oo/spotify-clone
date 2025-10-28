import { axiosInstance } from "@/lib/axios";
import { Playlist, UserLibrary } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface LibraryStore {
	userLibrary: UserLibrary | null;
	isLoading: boolean;
	error: string | null;
	selectedPlaylistForAdd: string | null;

	// Library actions
	fetchUserLibrary: () => Promise<void>;
	toggleLikeSong: (songId: string) => Promise<void>;
	toggleLikeAlbum: (albumId: string) => Promise<void>;
	toggleFollowArtist: (artistName: string) => Promise<void>;
	checkIsLiked: (type: 'song' | 'album' | 'artist', id: string) => Promise<boolean>;

	// Playlist actions
	createPlaylist: (name: string, description?: string, isPublic?: boolean) => Promise<void>;
	updatePlaylist: (id: string, data: { name?: string; description?: string; isPublic?: boolean }) => Promise<void>;
	deletePlaylist: (id: string) => Promise<void>;
	addSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
	removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
	getPlaylistById: (id: string) => Promise<Playlist | null>;

	// UI state
	setSelectedPlaylistForAdd: (playlistId: string | null) => void;
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
	userLibrary: null,
	isLoading: false,
	error: null,
	selectedPlaylistForAdd: null,

	fetchUserLibrary: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/library");
			set({ userLibrary: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch library" });
		} finally {
			set({ isLoading: false });
		}
	},

	toggleLikeSong: async (songId: string) => {
		try {
			const response = await axiosInstance.post(`/library/songs/${songId}`);
			const { isLiked, message } = response.data;
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				if (isLiked) {
					// Add song to liked songs (we need to fetch the song details)
					try {
						const songResponse = await axiosInstance.get(`/songs/${songId}`);
						userLibrary.likedSongs.push(songResponse.data);
						
						// Also add to liked songs playlist
						const likedSongsPlaylist = userLibrary.playlists.find(p => p.isLikedSongs);
						if (likedSongsPlaylist) {
							likedSongsPlaylist.songs.push(songResponse.data);
						}
					} catch (fetchError) {
						console.error("Error fetching song details:", fetchError);
					}
				} else {
					// Remove song from liked songs
					userLibrary.likedSongs = userLibrary.likedSongs.filter(song => song._id !== songId);
					
					// Also remove from liked songs playlist
					const likedSongsPlaylist = userLibrary.playlists.find(p => p.isLikedSongs);
					if (likedSongsPlaylist) {
						likedSongsPlaylist.songs = likedSongsPlaylist.songs.filter(song => song._id !== songId);
					}
				}
				set({ userLibrary: { ...userLibrary } });
			}
			
			toast.success(message);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to toggle like song");
		}
	},

	toggleLikeAlbum: async (albumId: string) => {
		try {
			const response = await axiosInstance.post(`/library/albums/${albumId}`);
			const { isLiked, message } = response.data;
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				if (isLiked) {
					// Add album to liked albums (we need to fetch the album details)
					try {
						const albumResponse = await axiosInstance.get(`/albums/${albumId}`);
						userLibrary.likedAlbums.push(albumResponse.data);
					} catch (fetchError) {
						console.error("Error fetching album details:", fetchError);
					}
				} else {
					// Remove album from liked albums
					userLibrary.likedAlbums = userLibrary.likedAlbums.filter(album => album._id !== albumId);
				}
				set({ userLibrary: { ...userLibrary } });
			}
			
			toast.success(message);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to toggle like album");
		}
	},

	toggleFollowArtist: async (artistName: string) => {
		try {
			const response = await axiosInstance.post(`/library/artists/${encodeURIComponent(artistName)}`);
			const { isFollowing, message } = response.data;
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				if (isFollowing) {
					userLibrary.followedArtists.push(artistName);
				} else {
					userLibrary.followedArtists = userLibrary.followedArtists.filter(artist => artist !== artistName);
				}
				set({ userLibrary: { ...userLibrary } });
			}
			
			toast.success(message);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to toggle follow artist");
		}
	},

	checkIsLiked: async (type: 'song' | 'album' | 'artist', id: string) => {
		try {
			const response = await axiosInstance.get(`/library/check/${type}/${encodeURIComponent(id)}`);
			return response.data.isLiked;
		} catch (error: any) {
			console.error("Failed to check if liked:", error);
			return false;
		}
	},

	createPlaylist: async (name: string, description = "", isPublic = true) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post("/playlists", {
				name,
				description,
				isPublic,
			});
			
			// Add to local state
			const { userLibrary } = get();
			if (userLibrary) {
				userLibrary.playlists.push(response.data);
				set({ userLibrary: { ...userLibrary } });
			}
			
			toast.success("Playlist created successfully");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to create playlist");
		} finally {
			set({ isLoading: false });
		}
	},

	updatePlaylist: async (id: string, data: { name?: string; description?: string; isPublic?: boolean }) => {
		try {
			const response = await axiosInstance.put(`/playlists/${id}`, data);
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				const playlistIndex = userLibrary.playlists.findIndex(p => p._id === id);
				if (playlistIndex !== -1) {
					userLibrary.playlists[playlistIndex] = response.data;
					set({ userLibrary: { ...userLibrary } });
				}
			}
			
			toast.success("Playlist updated successfully");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to update playlist");
		}
	},

	deletePlaylist: async (id: string) => {
		try {
			await axiosInstance.delete(`/playlists/${id}`);
			
			// Remove from local state
			const { userLibrary } = get();
			if (userLibrary) {
				userLibrary.playlists = userLibrary.playlists.filter(p => p._id !== id);
				set({ userLibrary: { ...userLibrary } });
			}
			
			toast.success("Playlist deleted successfully");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to delete playlist");
		}
	},

	addSongToPlaylist: async (playlistId: string, songId: string) => {
		try {
			await axiosInstance.post(`/playlists/${playlistId}/songs`, { songId });
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				const playlist = userLibrary.playlists.find(p => p._id === playlistId);
				if (playlist) {
					// Fetch song details to add to playlist
					try {
						const songResponse = await axiosInstance.get(`/songs/${songId}`);
						playlist.songs.push(songResponse.data);
						set({ userLibrary: { ...userLibrary } });
					} catch (fetchError) {
						console.error("Error fetching song details:", fetchError);
					}
				}
			}
			
			toast.success("Song added to playlist");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to add song to playlist");
		}
	},

	removeSongFromPlaylist: async (playlistId: string, songId: string) => {
		try {
			await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
			
			// Update local state
			const { userLibrary } = get();
			if (userLibrary) {
				const playlist = userLibrary.playlists.find(p => p._id === playlistId);
				if (playlist) {
					playlist.songs = playlist.songs.filter(song => song._id !== songId);
					set({ userLibrary: { ...userLibrary } });
				}
			}
			
			toast.success("Song removed from playlist");
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to remove song from playlist");
		}
	},

	getPlaylistById: async (id: string) => {
		try {
			const response = await axiosInstance.get(`/playlists/${id}`);
			return response.data;
		} catch (error: any) {
			console.error("Failed to fetch playlist:", error);
			return null;
		}
	},

	setSelectedPlaylistForAdd: (playlistId: string | null) => {
		set({ selectedPlaylistForAdd: playlistId });
	},
}));