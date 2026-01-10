import { X, Folder } from "lucide-react";
import { SidebarHeaderProps } from "../types/sidebar.types";
import SearchInput from "./SearchInput";


export default function SidebarHeader({
  categoriesCount,
  onClose,
  searchQuery,
  onSearchChange,
}: SidebarHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Folder className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Все категории
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {categoriesCount} разделов
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          aria-label="Закрыть меню"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <SearchInput value={searchQuery} onChange={onSearchChange} />
    </div>
  );
}