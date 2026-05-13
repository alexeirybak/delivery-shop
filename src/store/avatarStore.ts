import { create } from "zustand";

interface AvatarStore {
  avatarUrl: string | null;
  avatarVersion: number; 
  setAvatarUrl: (url: string | null) => void;
  refreshAvatar: () => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  avatarUrl: null,
  avatarVersion: 0,
  setAvatarUrl: (url) => set({ avatarUrl: url, avatarVersion: Date.now() }),
  refreshAvatar: () =>
    set((state) => ({ avatarVersion: state.avatarVersion + 1 })),
}));
