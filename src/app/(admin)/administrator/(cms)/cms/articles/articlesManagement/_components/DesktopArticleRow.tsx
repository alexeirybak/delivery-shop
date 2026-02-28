import { Check, ChevronDown, Edit, Eye, Star } from "lucide-react";
import { ArticleStatus, SortableItemProps } from "../types";
import { DragHandle } from "../../../_components/DragHandle";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { useRouter } from "next/navigation";
import { getStatusStyles } from "../utils/getStatusStyles";

export const DesktopArticleRow = ({
  article,
  displayNumericId,
  isDragging = false,
}: SortableItemProps) => {
  const { updateArticleStatus, updateArticleFeatured } =
    useArticlesManagementStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/administrator/cms/articles/editor?id=${article._id}`);
  };

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    setIsDropdownOpen(false);
    try {
      await updateArticleStatus(article._id.toString(), newStatus);
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
    }
  };

  const handleFeaturedToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await updateArticleFeatured(article._id.toString(), !article.isFeatured);
    } catch (error) {
      console.error("Ошибка изменения избранности:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const statusInfo = getStatusStyles(article.status);

  return (
    <div
      className={`p-4 hover:bg-gray-50 text-sm transition-custom ${
        isDragging
          ? "opacity-60 bg-linear-to-r from-blue-50 to-green-50 shadow-lg border-2 border-green-400 transform scale-[0.995]"
          : "hover:shadow-sm"
      }`}
    >
      <div className="grid lg:grid-cols-[32px_56px_100px_100px_100px_56px_128px_80px_80px_40px_100px]  xl:grid-cols-[32px_56px_170px_150px_150px_56px_128px_100px_120px_50px_100px] gap-2 items-center justify-between">
        <div>
          <DragHandle />
        </div>

        <div className="flex justify-center">
          <span
            className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-xs font-medium shrink-0"
            title="Порядковый номер"
          >
            {displayNumericId || "-"}
          </span>
        </div>

        <div className="min-w-0">
          <div
            className="text-xs text-main-text wrap-break-words"
            title={article.name}
          >
            {article.name}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-xs bg-gray-100 px-2 py-1 rounded break-all font-mono"
            title={`Ссылка: ${article.slug}`}
          >
            {article.slug}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-xs bg-gray-100 px-2 py-1 rounded break-all font-mono"
            title={`Категория: ${article.categoryName}`}
          >
            {article.categoryName}
          </div>
        </div>
        <div className="min-w-0 mx-auto">
          <button
            onClick={handleFeaturedToggle}
            className={`text-xs px-2 py-1 rounded break-all font-mono flex items-center justify-center w-8 cursor-pointer  ${
              article.isFeatured
                ? "bg-yellow-50 hover:bg-yellow-100"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            title={
              article.isFeatured
                ? "Убрать из избранного"
                : "Добавить в избранное"
            }
          >
            <Star
              className={`w-4 h-4 ${
                article.isFeatured
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="min-w-0 relative" ref={dropdownRef}>
          <div
            className={`text-xs px-2 py-1 rounded break-all font-mono border cursor-pointer flex items-center justify-between ${statusInfo.className}`}
            title={`Статус: ${statusInfo.label}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(!isDropdownOpen);
            }}
          >
            <span>{statusInfo.label}</span>
            <ChevronDown
              className={`w-3 h-3 ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {isDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 border border-gray-200 rounded shadow-lg z-10 flex items-stretch justify-between">
              <div className="w-full">
                {(
                  [
                    "published",
                    "draft",
                    "archived",
                    "deleted",
                  ] as ArticleStatus[]
                ).map((status) => {
                  const statusStyle = getStatusStyles(status);
                  return (
                    <button
                      key={status}
                      className={`flex flex-1 items-center justify-between w-full px-3 py-2 text-xs text-left hover:bg-gray-50 cursor-pointer ${statusStyle.className}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(status);
                      }}
                    >
                      <span>{statusStyle.label}</span>
                      {article.status === status && (
                        <Check className="w-3 h-3" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 flex justify-center">
          <div
            className="text-gray-600 text-xs wrap-break-word text-center"
            title={article.author || "Автор неизвестен"}
          >
            {article.author || <span className="text-gray-400">—</span>}
          </div>
        </div>

        <div className="min-w-0">
          <div
            className="text-gray-600 text-xs wrap-break-word"
            title={`Дата создания: ${new Date(article.createdAt).toLocaleDateString("ru-RU")}`}
          >
            {new Date(article.createdAt).toLocaleDateString("ru-RU")}
          </div>
        </div>
        <div className="min-w-0">
          <div
            className="text-sm text-center px-2 py-1 rounded break-all font-mono"
            title={`Просмотров: ${article.views}`}
          >
            {article.views}
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex gap-2 justify-center">
            {article.status !== "deleted" && (
              <button
                onClick={handleEdit}
                className="p-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center cursor-pointer transition-custom shrink-0"
                title="Редактировать статью"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}

            {(article.status === "published" ||
              article.status === "archived") && (
              <Link
                href={`/blog/${article.categorySlug}/${article.slug}`}
                target="_blank"
                className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center cursor-pointer transition-custom shrink-0"
                title="Просмотреть статью"
              >
                <Eye className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
