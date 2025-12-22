import { ImageIcon } from "lucide-react";

export const TableHeader = () => {
  return (
    <div className="hidden lg:block border border-gray-200">
      <div className="grid grid-cols-[0.3fr_0.5fr_1fr_2fr_2fr_2fr_2fr_1fr_1fr_2fr] gap-2 px-2 py-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div></div>
        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          title="Сортировать по ID"
        >
          ID
        </div>
        <div
          className="text-center flex items-center justify-center"
          title="Изображение категории"
        >
          <ImageIcon className="w-4 h-4" />
        </div>

        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          title="Сортировать по названию"
        >
          Название
        </div>
        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          title="Сортировать по алиасу"
        >
          Алиас
        </div>
        <div>Описание</div>
        <div className="text-center">Ключевые слова</div>
        <div
          className="text-center cursor-pointer hover:text-gray-700 flex items-center justify-center"
          title="Сортировать по автору"
        >
          Автор
        </div>
        <div
          className="cursor-pointer hover:text-gray-700 flex items-center"
          title="Сортировать по дате создания"
        >
          Создана
        </div>
        <div className="text-center">Действия</div>
      </div>
    </div>
  );
};
