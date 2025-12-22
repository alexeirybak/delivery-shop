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

export interface DashboardCardProps {
  card: DashboardCard;
  navigateTo: (path: string) => void;
}

export interface HeaderProps {
  title: string;
  description?: string;
}

export interface StatItem {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
}

export interface StatItemProps {
  stat: {
    title: string;
    icon: React.ReactNode;
    color: string;
  };
  statValue: string;
}
