import { CommentsListProps } from "../types/comments.types";
import { CommentRow } from "./CommentRow";
import { Loader } from "@/components/Loader";

export default function CommentsList({
  comments,
  loading,
  deletingId,
  onDelete,
}: CommentsListProps) {
  if (loading) {
    return <Loader />;
  }

  if (comments.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">Нет комментариев за выбранный период</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {comments.map((comment) => (
        <div
          key={comment._id}
          className="flex-1 justify-center bg-white rounded border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex-1 justify-center hover:bg-gray-50">
            <CommentRow
              key={comment._id}
              comment={comment}
              deletingId={deletingId}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
