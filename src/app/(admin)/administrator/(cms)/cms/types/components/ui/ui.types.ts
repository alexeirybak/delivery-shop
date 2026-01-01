export interface SubmitSectionProps {
  onCancel: () => void;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}
