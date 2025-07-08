import { CatalogGridProps } from "@/types/catalogGridProps";
import GridCategoryBlock from "./GridCategoryBlock";

const CatalogGrid = ({
  categories,
  isEditing,
  draggedCategory,
  hoveredCategoryId,
  onDragStartAction,
  onDragOverAction,
  onDragLeaveAction,
  onDropAction,
}: CatalogGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8">
      {categories.map((category, index) => (
        <div
          key={category._id}
          className={`${category.mobileColSpan} ${category.tabletColSpan} ${
            category.colSpan
          } bg-gray-100 rounded overflow-hidden min-h-50 h-full
            ${isEditing ? "border-4 border-dashed border-gray-400" : ""}
            ${
              hoveredCategoryId === category._id
                ? "border-3 border-red-800"
                : ""
            }
                `}
          onDragOver={(e) => onDragOverAction(e, category._id)}
          onDragLeave={onDragLeaveAction}
          onDrop={(e) => onDropAction(e, category._id)}
        >
          <div
            className={`h-full w-full ${
              draggedCategory?._id === category._id ? "opacity-50" : " "
            }`}
            draggable={isEditing}
            onDragStart={() => onDragStartAction(category)}
          >
            <GridCategoryBlock
              slug={category.slug}
              title={category.title}
              img={category.img}
              priority={index < 4}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CatalogGrid;
