interface LibraryStatsProps {
  totalMaterials: number;
  activeDays: number;
  uniqueTypesCount: number;
  favoritesCount: number;
}

export const LibraryStats = ({ 
  totalMaterials, 
  activeDays, 
  uniqueTypesCount, 
  favoritesCount 
}: LibraryStatsProps) => {
  return (
    <div className="library-stats-bar">
      <div className="stat">
        <span className="stat-value">{totalMaterials}</span>
        <span className="stat-label">Всего материалов</span>
      </div>
      <div className="stat">
        <span className="stat-value">{activeDays}</span>
        <span className="stat-label">Активных дней</span>
      </div>
      <div className="stat">
        <span className="stat-value">{uniqueTypesCount}</span>
        <span className="stat-label">Типов материалов</span>
      </div>
      <div className="stat">
        <span className="stat-value">{favoritesCount}</span>
        <span className="stat-label">В избранном</span>
      </div>
    </div>
  );
};