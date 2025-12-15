"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import SidebarMenu from "../blog/_CMSComponents/SidebarMenu";

export default function CMSLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Не показывать кнопку на главной /cms
  const isCMSRoot = pathname === "/administrator/cms";
  
  return (
    <>
      {/* Плавающая кнопка (только не на главной) */}
      {!isCMSRoot && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-17 right-6 z-100 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 duration-300 cursor-pointer"
          aria-label="Открыть меню"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
      
      {/* Основной контент */}
      <main className="min-h-screen bg-gray-50 p-6 max-w-4xl mx-auto">
        {children}
      </main>
      
      {/* Всплывающее меню */}
      <SidebarMenu 
        isOpen={isSidebarOpen} 
        onCloseAction={() => setIsSidebarOpen(false)} 
      />
    </>
  );
}