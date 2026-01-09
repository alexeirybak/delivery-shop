import { BlogCategoriesListProps } from "../types/categories.types";
import "../css/animations.css";
import CategoryCard from "./CategoryCard";

export default async function CategoriesList({
  categories,
}: BlogCategoriesListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {categories.map((category, index) => {
        const delayClass = `animate-delay-${Math.min(index, 8)}`;

        return (
          <div
            key={category._id}
            className={`animate-gentle-appear ${delayClass}`}
          >
            <CategoryCard category={category} priority={index < 4} />
          </div>
        );
      })}
    </div>
  );
}
