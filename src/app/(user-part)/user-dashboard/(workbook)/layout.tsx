"use client";

import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./workbook/_components/sidebarMenu/SidebarMenu";
import "./styles/workbook-layout.css";

export default function WorkbookLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isWorkbookRoot = pathname === "/user-dashboard/workbook";

  return (
    <div className="workbook-layout">
      {!isWorkbookRoot && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="workbook-menu-button"
          aria-label="Открыть меню"
        >
          <Menu />
        </button>
      )}
      <main>{children}</main>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onCloseAction={() => setIsSidebarOpen(false)}
      />
    </div>
  );
}
