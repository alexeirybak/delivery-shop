export const getNetworkGraphNodeColor = (group?: string): string => {
  const colors = [
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
  ];
  if (!group) return "#94a3b8";
  const hash = group
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};
