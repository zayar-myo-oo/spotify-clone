import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface User {
	_id: string;
	clerkId: string;
	fullName: string;
	imageUrl: string;
	isArtist: boolean;
	artistName?: string;
}

interface UserStore {
	currentUser: User | null;
	isLoading: boolean;
	error: string | null;
	
	fetchCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
	currentUser: null,
	isLoading: false,
	error: null,

	fetchCurrentUser: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/auth/me");
			set({ currentUser: response.data });
		} catch (error: any) {
			set({ error: error.response?.data?.message || "Failed to fetch user" });
		} finally {
			set({ isLoading: false });
		}
	},
}));