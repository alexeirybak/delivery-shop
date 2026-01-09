import { Menu } from "lucide-react";
import { FloatingMenuButtonProps } from "../types/sidebar.types";

export default function FloatingMenuButton({
  onClick,
  categoriesCount,
}: FloatingMenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-40 w-14 h-14 rounded-full bg-linear-to-br from-blue-500 to-purple-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 duration-300 flex items-center justify-center group animate-float cursor-pointer"
      aria-label="Открыть меню категорий"
    >
      <Menu className="w-6 h-6 transition-transform group-hover:rotate-90" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
        {categoriesCount}
      </span>
    </button>
  );
}