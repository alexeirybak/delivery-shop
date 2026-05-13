export const generateChartColors = (count: number): string[] => {
  const colors = [
    "#6df1ff",
    "#5290ff",
    "#8a6fff",
    "#7df4d6",
    "#ff88de",
    "#ffa500",
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#a3e635",
    "#34d399",
    "#22d3ee",
    "#60a5fa",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#84cc16",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
  ];
  return colors.slice(0, count);
};