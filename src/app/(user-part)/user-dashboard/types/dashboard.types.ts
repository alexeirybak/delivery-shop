export type CollectionType =
  | "all"
  | "education"
  | "learning"
  | "scientific-articles"
  | "visualizations"
  | "writing"
  | "audio";

export interface DashboardChat {
  id: string;
  title: string;
  mode: string;
  createdAt: Date;
  updatedAt: Date;
  messagesCount: number;
  lastMessage: string;
  sourceCollection: Exclude<CollectionType, "all">;
  isFavorite?: boolean;
}

export interface RecentGenerationsProps {
  chats: DashboardChat[];
  isLoading: boolean;
  deletingId: string | null;
  onDelete: (chatId: string, e: React.MouseEvent) => void;
  onDownload: (chatId: string, e: React.MouseEvent) => void;
  onShare: (chatId: string, e: React.MouseEvent) => void;
}

export type SortBy =
  | "createdAt"
  | "updatedAt"
  | "title"
  | "messages"
  | "favorite";
export type SortOrder = "asc" | "desc";
