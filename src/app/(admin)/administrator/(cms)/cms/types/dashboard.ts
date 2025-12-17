import { ReactNode } from "react";

export interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  actionText: string;
}

export interface StatItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}