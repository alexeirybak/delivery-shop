export type UserRole = "user" | "admin" | "manager";

export type SortOrder = "newest" | "oldest";

export interface IComment {
  _id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  parentId: string | null;
  replies: IComment[];
  createdAt: string;
  updatedAt: string;
  likes: string[];
  isEdited: boolean;
  editedAt?: string;
  articleName?: string;
  articleSlug?: string;
  categorySlug?: string;
}

export type CommentData = IComment;

export interface CommentItemProps {
  comment: IComment;
  articleId: string;
  onCommentChange: () => void;
  depth: number;
}

export interface CommentFormProps {
  articleId: string;
  parentId: string | null;
  onSuccess: (comment: IComment) => void;
  placeholder?: string;
}

export interface CommentHeaderProps {
  comment: IComment;
  canEdit: boolean;
  canDelete: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
  deleteButtonTitle: string;
}

export interface CommentAvatarProps {
  authorId: string;
  authorName: string;
}

export interface CommentRepliesProps {
  replies: IComment[];
  articleId: string;
  depth: number;
  onCommentChange: () => void;
}

export interface CommentActionsProps {
  isLiked: boolean;
  likeCount: number;
  canReply: boolean;
  onLike: () => void;
  onReply: () => void;
  liking: boolean;
  currentUserId?: string;
}

export interface CommentEditFormProps {
  commentId: string;
  initialContent: string;
  userId: string;
  onSuccess: (content: string, editedAt: string) => void;
  onCancel: () => void;
}

export interface CommentSortButtonsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export interface LoadMoreCommentsProps {
  hasMore: boolean;
  remainingCount: number;
  onLoadMore: () => void;
  totalRootComments: number;
}

export interface BanInfo {
  isBanned: boolean;
  bannedUntil: string | null;
}
