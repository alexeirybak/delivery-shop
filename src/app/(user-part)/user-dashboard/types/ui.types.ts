export interface ContentTypeCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  gradient: string;
  icon: React.ElementType;
  link: string;
  mode?: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export interface ModeConfig {
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  description: string;
}
