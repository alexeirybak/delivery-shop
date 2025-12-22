import { ReactNode } from "react";

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  hoverColor: string;
  shadow: string;
  path: string;
}

export interface MenuItemsListProps {
  items: MenuItem[];
  onItemClick: (path: string) => void;
}

export interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MenuHeaderProps {
  isOpen: boolean;
  onCloseAction: () => void;
  icon: ReactNode;
}

export interface SidebarMenuProps {
  isOpen: boolean;
  onCloseAction: () => void;
}
