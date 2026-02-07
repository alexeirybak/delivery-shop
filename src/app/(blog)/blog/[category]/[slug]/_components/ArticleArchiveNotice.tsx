import { AlertCircle, Clock } from "lucide-react";

const ArticleArchiveNotice = ({
  message = "Статья находится в архиве. Информация может быть устаревшей.",
  className = "",
  updatedAt = "Неизвестно",
}: {
  message?: string;
  className?: string;
  updatedAt?: string;
}) => {
  return (
    <div
      className={`
        flex items-start gap-x-3 mb-4 p-3 rounded text-sm
        bg-yellow-50 border border-yellow-200 text-yellow-800
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <div>
        <p className="mt-1">{message}</p>
        <div className="flex items-center gap-x-2 mt-2 text-xs opacity-75">
          <Clock className="h-3 w-3" />
          <span>
            Последнее обновление:{" "}
            {updatedAt
              ? new Date(updatedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })
              : "неизвестно"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleArchiveNotice;
