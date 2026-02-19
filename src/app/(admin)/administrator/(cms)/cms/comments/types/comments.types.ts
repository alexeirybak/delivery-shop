import { IComment } from "@/app/(blog)/blog/types";

export interface DateFilterProps {
  dateFrom: string;
  dateTo: string;
  activeFilter: string;
  onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetToday: () => void;
  onSetLast3Days: () => void;
  onSetLastWeek: () => void;
  onSetLastMonth: () => void;
  onClearFilters: () => void;
  getTodayDate: () => string;
}

export interface CommentRowProps {
  comment: IComment;
  deletingId: string | null;
  onDelete: (commentId: string) => void;
}

export interface CommentsListProps {
  comments: IComment[];
  loading: boolean;
  deletingId: string | null;
  onDelete: (commentId: string) => void;
}

export interface CommentsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface LoadCommentsParams {
  page?: number;
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  article?: string;
}

export interface BanUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBan: (days: number | null) => void;
  onUnban: () => void;
  userName: string;
  userId: string;
  isBanned: boolean;
  bannedUntil?: string | null;
}

export interface CommentsFiltersProps {
  dateFrom: string;
  dateTo: string;
  activeFilter: string;
  authorFilter: string;
  articleFilter: string;
  onDateFromChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateToChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSetToday: () => void;
  onSetLast3Days: () => void;
  onSetLastWeek: () => void;
  onSetLastMonth: () => void;
  onApplyFilters: (author: string, article: string) => void;
  onClearFilters: () => void;
  getTodayDate: () => string;
}
