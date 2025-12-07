import { ReactNode } from "react";

interface ToolbarGroupProps {
  children: ReactNode;
}

export default function ToolbarGroup({ children }: ToolbarGroupProps) {
  return (
    <div className="flex items-center border-r pr-3 mr-3 gap-1">
      {children}
    </div>
  );
}