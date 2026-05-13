"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookCopy } from "lucide-react";
import { MenuOverlay } from "./MenuOverlay";
import { MenuHeader } from "./MenuHeader";
import { MenuItemsList } from "./MenuItemsList";
import { MenuFooter } from "./MenuFooter";
import { menuItems } from "../../utils/menuItems";
import "../../../styles/sidebar-menu.css";
import { SidebarMenuProps } from "../../types/sidebar/sidebar.types";

export const SidebarMenu = ({ isOpen, onCloseAction }: SidebarMenuProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCloseAction();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCloseAction]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  const handleItemClick = (path: string) => {
    router.push(path);
    onCloseAction();
  };

  return (
    <>
      <MenuOverlay isOpen={isOpen} onClose={onCloseAction} />

      <div
        className={`sidebar-menu-container ${isOpen ? "open" : "closed"}`}
      >
        <div className="sidebar-menu-glow-left" />
        <div className="sidebar-menu-glow-top" />

        <div className="sidebar-menu-content">
          <div className="sidebar-menu-backdrop" />
          <div className="sidebar-menu-gradient" />

          <div className="sidebar-menu-inner">
            <div className="sidebar-menu-header">
              <MenuHeader
                isOpen={isOpen}
                onCloseAction={onCloseAction}
                icon={<BookCopy className="relative w-7 h-7 text-cyan-500" />}
              />
            </div>
            <div className="sidebar-menu-body">
              <MenuItemsList items={menuItems} onItemClick={handleItemClick} />
            </div>
            <div className="sidebar-menu-footer">
              <MenuFooter />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};