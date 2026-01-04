import { ReactNode } from "react";

export interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
  children?: ReactNode;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface SubmitSectionProps {
  onCancel: () => void;
}

export interface PaginationProps {
  onPageChangeAction: (page: number) => void;
  itemName?: string; 
}



