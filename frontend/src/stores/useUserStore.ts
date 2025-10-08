import { create } from 'zustand';
import {axiosInstance} from "@/lib/axios.ts";

interface User {
    fullName: string;
    imageUrl: string;
    clerkId: string;
    isArtist?: boolean;
    status?: boolean | number;
}
interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  requestArtist: (artistData: string | null) => Promise<void>;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  logout: () => set({ user: null }),

  requestArtist: async (userID) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post('/users/requestArtist', userID);
      set({ loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.response?.data?.message || 'Request failed' });
    }
  }
}));
