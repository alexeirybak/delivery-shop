import { Eye } from "lucide-react";
import { ArticleMetaProps } from "../../../types";

const ArticleMeta = ({
  categoryName,
  publishedDate,
  views,
}: ArticleMetaProps) => {
  return (
    <div className="flex gap-4 mb-6 text-gray-600">
      <span>Категория: {categoryName}</span>
      {publishedDate && (
        <span>Дата: {new Date(publishedDate).toLocaleDateString("ru-RU")}</span>
      )}

      <div className="flex items-center gap-1">
        <Eye className="w-4 h-4" />
        <span>
          <span className="hidden md:block">Просмотров: </span>
          {views?.toLocaleString("ru-RU")}
        </span>
      </div>
    </div>
  );
};

export default ArticleMeta;
