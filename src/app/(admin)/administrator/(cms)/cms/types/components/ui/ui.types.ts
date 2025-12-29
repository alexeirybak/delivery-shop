import { ReactNode } from "react";

export interface NotificationProps {
  type: "success" | "error" | "warning";
  message: string;
  onClose: () => void;
  children?: ReactNode;
}

export interface HeaderActionsProps {
  isReordering: boolean;
  onCreate: () => void;
}

export interface SubmitSectionProps {
  isSubmitting: boolean | undefined;
  isUploading: boolean;
  onCancel: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChangeAction: (page: number) => void;
  itemName?: string; 
}



