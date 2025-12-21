export const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
  return (
    <div className="p-8 text-center text-gray-500">
      {searchQuery
        ? "Ничего не найдено по вашему запросу"
        : "Категорий пока нет"}
    </div>
  );
};
