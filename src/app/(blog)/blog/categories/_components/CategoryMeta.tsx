import { BlogCategoryMetaProps } from "../types/categories.types";

export default function CategoryMeta({
  createdAt,
  author,
}: BlogCategoryMetaProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between mb-3">
      <time
        dateTime={createdAt}
        className="text-xs text-gray-500 font-medium"
        title={formattedDate}
      >
        {formattedDate}
      </time>

      {author && (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></div>
          <span className="text-xs text-gray-600 font-medium">{author}</span>
        </div>
      )}
    </div>
  );
}
