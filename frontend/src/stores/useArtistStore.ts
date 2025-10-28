import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";

interface ArtistStore {
	songs: Song[];
	albums: Album[];
	followers: any[];
	isLoading: boolean;
	error: string | null;

	fetchArtistAlbums: () => Promise<void>;
	fetchArtistSongs: () => Promise<void>;
	fetchArtistFollowers: () => Promise<void>;
	updateSong: (id: string, formData: FormData) => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	createSong: (formData: FormData) => Promise<void>;
	createAlbum: (formData: FormData) => Promise<void>;
}

export const useArtistStore = create<ArtistStore>((set) => ({
	albums: [],
	songs: [],
	followers: [],
	isLoading: false,
	error: null,

	fetchArtistAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch albums" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtistSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch songs" });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchArtistFollowers: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/followers");
			set({ followers: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch followers" });
		} finally {
			set({ isLoading: false });
		}
	},

	updateSong: async (id, formData) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.put(`/artist/songs/${id}`, formData);
			set((state) => ({
				songs: state.songs.map((song) => (song._id === id ? response.data : song)),
			}));
			toast.success("Song updated successfully");
		} catch (error: any) {
			toast.error("Error updating song");
		} finally {
			set({ isLoading: false });
		}
	},

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/artist/songs/${id}`);
			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},

	createSong: async (formData) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.post("/artist/songs", formData);
			toast.success("Song created successfully");
		} catch (error: any) {
			toast.error("Failed to create song");
		} finally {
			set({ isLoading: false });
		}
	},

	createAlbum: async (formData) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.post("/artist/albums", formData);
			toast.success("Album created successfully");
		} catch (error: any) {
			toast.error("Failed to create album");
		} finally {
			set({ isLoading: false });
		}
	},
}));