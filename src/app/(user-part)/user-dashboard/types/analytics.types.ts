export interface AnalyticsViewProps {
  onTabChange?: (tab: string) => void;
}

export interface AnalyticsData {
  totalMaterials: number;
  totalMessages: number;
  activeDays: number;
  averageMessagesPerChat: number;
  mostUsedMode: string;
  modeStats: Record<string, number>;
  activityByDay: { date: string; count: number }[];
  generationTrend: number;
}