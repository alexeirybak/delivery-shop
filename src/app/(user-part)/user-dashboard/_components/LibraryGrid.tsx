import { DashboardChat } from "../types";
import { LibraryCard } from "./LibraryCard";

interface LibraryGridProps {
  materials: DashboardChat[];
  viewMode: "grid" | "list";
  onMaterialDeleted: () => void;
}

export const LibraryGrid = ({
  materials,
  viewMode,
  onMaterialDeleted,
}: LibraryGridProps) => {
  return (
    <div className={`library-grid ${viewMode}`}>
      {materials.map((material) => (
        <LibraryCard
          key={material.id}
          material={material}
          viewMode={viewMode}
          isFavorited={material.isFavorite || false}
          onFavoriteChange={() => {}}
          onMaterialDeleted={onMaterialDeleted}
        />
      ))}
    </div>
  );
};
