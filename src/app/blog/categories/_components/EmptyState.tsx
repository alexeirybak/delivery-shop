import { FolderX } from 'lucide-react';

export default function EmptyState() {
  return (
    <div className="text-center py-16 bg-white rounded shadow-xl">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <FolderX className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Категории не найдены
      </h2>
      <p className="text-gray-500">
        Пока нет доступных категорий для отображения
      </p>
    </div>
  );
}