import { ArticleStatus } from "@/app/(user-part)/user-dashboard/science/types";
import { create } from "zustand";

interface ArticleStatusStore {
  status: ArticleStatus;
  setStatus: (
    status: "structure_generated" | "writing" | "completed" | "idle",
  ) => void;
}

export const useArticleStatusStore = create<ArticleStatusStore>((set) => ({
  status: "idle",
  setStatus: (status) => set({ status }),
}));
