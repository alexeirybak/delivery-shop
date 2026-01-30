export interface SubmitSectionProps {
  onCancel: () => void;
  onSaveAndContinue?: () => void;
  isSaveAndContinueMode?: boolean;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export interface FilterControlsProps {
  onToggleFilters?: (show: boolean) => void;
}
