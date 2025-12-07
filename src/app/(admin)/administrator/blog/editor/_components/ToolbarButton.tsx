import { ReactNode } from "react";

interface ToolbarButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  title?: string;
  activeClassName?: string;
}

export default function ToolbarButton({
  children,
  onClick,
  isActive = false,
  disabled = false,
  className = "",
  title,
  activeClassName = "bg-gray-200 text-gray-800 shadow-inner",
}: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded duration-300 ${
        isActive
          ? activeClassName
          : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
      title={title}
    >
      {children}
    </button>
  );
}