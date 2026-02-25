"use client";

import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarMenu } from "./sidebarMenu/SidebarMenu";

export default function CMSLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isCMSRoot = pathname === "/administrator/cms";

  return (
    <>
      {!isCMSRoot && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-17 right-6 z-100 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-custom cursor-pointer"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      <main className="min-h-screen bg-gray-50 p-6 w-full mx-auto">
        {children}
      </main>
      <SidebarMenu
        isOpen={isSidebarOpen}
        onCloseAction={() => setIsSidebarOpen(false)}
      />
    </>
  );
}
