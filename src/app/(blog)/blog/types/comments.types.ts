export type UserRole = "user" | "admin" | "manager" | "author";

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

export interface CommentsProps {
  articleId: string;
}

export interface CommentItemProps {
  comment: IComment;
  articleId: string;
  onReply: (comment: IComment) => void;
  onDelete: (commentId: string) => void;
  depth: number;
}

export interface CommentFormProps {
  articleId: string;
  parentId: string | null;
  onSuccess: (comment: IComment) => void;
  placeholder?: string;
}

export interface CommentEditFormProps {
  commentId: string;
  initialContent: string;
  userId: string;
  onSuccess: (content: string, editedAt: string) => void;
  onCancel: () => void;
}
