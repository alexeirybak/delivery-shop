import EmptyState from "./EmptyState";
import CategoryItem from "./CategoryItem";
import { BlogCategoriesListProps } from "../../types/sidebar.types";

export default function CategoriesList({
  categories,
  searchQuery,
  onItemClick,
}: BlogCategoriesListProps) {
  if (categories.length === 0) {
    return <EmptyState hasSearchQuery={!!searchQuery} />;
  }

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <CategoryItem
          key={category._id}
          category={category}
          index={index}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
