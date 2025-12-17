import { X } from "lucide-react";
import { ReactNode } from "react";

interface MenuHeaderProps {
  isOpen: boolean;
  onCloseAction: () => void;
  icon: ReactNode;
}

export default function MenuHeader({ onCloseAction, icon }: MenuHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-10">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur opacity-70 animate-pulse" />
          {icon}
        </div>
        <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
          Быстрые действия
        </h2>
      </div>

      <button
        onClick={onCloseAction}
        className="group p-3 rounded-2xl bg-linear-to-br from-gray-100 to-white shadow-lg hover:shadow-xl hover:from-gray-200 duration-500 cursor-pointer transition-all hover:scale-110"
        aria-label="Закрыть меню"
      >
        <X className="w-6 h-6 text-gray-100 group-hover:text-gray-300 group-hover:rotate-90 transition-all duration-500" />
      </button>
    </div>
  );
}