import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
	isAdmin: boolean;
	isArtist: boolean;
	isLoading: boolean;
	error: string | null;

	checkAdminStatus: () => Promise<void>;
	checkArtistStatus: () => Promise<void>;
	reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
	isAdmin: false,
	isArtist: false,
	isLoading: false,
	error: null,

	checkAdminStatus: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/admin/check");
			set({ isAdmin: response.data.admin });
		} catch (error: any) {
			set({ isAdmin: false, error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	checkArtistStatus: async () => {
		try {
			const response = await axiosInstance.get("/auth/me");
			set({ isArtist: response.data.isArtist || false });
		} catch (error) {
			set({ isArtist: false });
		}
	},

	reset: () => {
		set({ isAdmin: false, isArtist: false, isLoading: false, error: null });
	},
}));
