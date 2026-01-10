import { SidebarOverlayProps } from "../types/sidebar.types";

export default function SidebarOverlay({
  isOpen,
  onClose,
}: SidebarOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
      onClick={onClose}
    />
  );
}