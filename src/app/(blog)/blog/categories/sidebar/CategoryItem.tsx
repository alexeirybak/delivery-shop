import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BlogCategoryItemProps } from "../types/sidebar.types";

export default function CategoryItem({
  category,
  index,
  onClick,
}: BlogCategoryItemProps) {
  return (
    <Link href={`/blog/categories/${category.slug}`} onClick={onClick}>
      <div
        className="group p-4 my-1 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 duration-300 hover:shadow-md animate-slide-in"
        style={{ animationDelay: `${index * 0.03}s` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {category.name}
              </h3>
            </div>
            {category.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
            {category.articleCount !== undefined && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {category.articleCount} статей
                </span>
              </div>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 duration-300" />
        </div>
      </div>
    </Link>
  );
}
