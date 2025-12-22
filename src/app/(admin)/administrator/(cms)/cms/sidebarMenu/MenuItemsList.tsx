import { MenuItemsListProps } from "../types/sidebar";
import { IconArrowAnim } from "./IconArrowAnim";

export const MenuItemsList = ({ items, onItemClick }: MenuItemsListProps) => {
  return (
    <div className="space-y-5">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.path)}
          className={`group w-full flex items-center gap-4 p-6 rounded-2xl text-left cursor-pointer duration-500 hover:shadow-2xl ${item.shadow} animate-slideIn`}
          style={{
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            animationDelay: `${index * 100}ms`,
            animationFillMode: "both",
          }}
        >
          <div
            className={`relative p-4 rounded-xl bg-white/90 backdrop-blur-sm group-hover:bg-white duration-500 ${item.shadow}`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-white to-gray-100 rounded-xl opacity-50" />
            <div className="relative">
              <div
                className={`absolute inset-0 bg-linear-to-br ${item.color} rounded-lg opacity-0 group-hover:opacity-20 blur duration-500`}
              />
              <div className="relative text-gray-700 group-hover:scale-110 transition-transform duration-500">
                {item.icon}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0"> {/* Добавьте min-w-0 */}
            <div className="font-bold text-lg text-gray-900 group-hover:text-gray-800 duration-300 truncate">
              {item.title}
            </div>
            <div className="text-sm text-gray-600 group-hover:text-gray-700 mt-1 duration-300 line-clamp-2">
              {item.description}
            </div>
          </div>

          <div className="shrink-0"> {/* Оберните стрелку */}
            <IconArrowAnim />
          </div>
        </button>
      ))}
    </div>
  );
};