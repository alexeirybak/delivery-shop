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
  editingId: string | null;
  isUploading: boolean;
  onCancel: () => void;
}



