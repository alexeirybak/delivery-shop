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
  avatars: Record<string, string>;
  avatarLoading: Record<string, boolean>;
  deletingId: string | null;
  authorGenders: Record<string, string>;
  onDelete: (commentId: string) => void;
  onAvatarError: (authorId: string, gender?: string) => void;
}

export interface CommentsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}