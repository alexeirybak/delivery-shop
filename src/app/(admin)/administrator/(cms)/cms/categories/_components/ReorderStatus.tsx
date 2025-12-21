interface ReorderStatusProps {
  isReordering: boolean;
}

export const ReorderStatus = ({ isReordering }: ReorderStatusProps) => {
  if (!isReordering) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      Обновление порядка категорий...
    </div>
  );
};

